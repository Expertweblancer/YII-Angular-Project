<?php

namespace app\controllers;

use app\components\BaseRestController;
use app\components\CustomCors;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\VerbFilter;
use app\models\Comment;
use app\models\Offer;
use app\models\Notifications;
use app\models\User;
use app\helpers\Helpers;
use app\models\Order;

class CommentController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Comment';
    
    /**
     * Describe controller behaviours
     * @return behaviors
     */
    public function behaviors() {
        $behaviors = parent::behaviors ();
        
        // remove authentication filter
        $auth = $behaviors ['authenticator'];
        unset ( $behaviors ['authenticator'] );
        
        // add CORS filter
        $behaviors ['corsFilter'] = CustomCors::getCors ();
        
        // re-add authentication filter
        $behaviors ['authenticator'] = [ 
                'except' => [ 
                        'get-by-user-id' 
                ],
                'class' => CompositeAuth::className (),
                'authMethods' => [ 
                        HttpBearerAuth::className () 
                ] 
        ];
        
        $behaviors ['verbs'] = [ 
                'class' => VerbFilter::className () 
        ];
        return $behaviors;
    }
    
    /**
     * Unset unnecessary REST actions
     *
     * @return actions array
     */
    public function actions() {
        $a = parent::actions ();
        unset ( $a ['index'] );
        unset ( $a ['create'] );
        unset ( $a ['view'] );
        
        return $a;
    }
    
    /**
     * Get avarage rating
     * @param integer $cid Company ID
     * @return object Avarage Rating
     */
    public function actionGetAverageRating($cid = 0) {
        // if company ID is not set then take ID of current user's company
        $id = $cid == 0 ? \Yii::$app->user->identity->companyProfileId : $cid;
        
        /* if still not any ID than return 0 */
        if (!$id)
            return [ 
                    'avg' => 0 
            ];
        
        $users = User::find ()->where ( "id_company_profile=$id" )->asArray ()->all ();
        
        if (! $users)
            return [ 
                    'avg' => 0 
            ];
        
        // Convert ID array to string
        $idstr = Helpers::getIdsStr ( $users, 'id' );
        
        // set query
        $query = "SELECT AVG(general_rating(punctuality_rating, contact_rating, price_rating)) as avg FROM `comment` INNER JOIN `order` ON comment.order_id=order.id INNER JOIN 
					offer ON offer.order_id = order.id WHERE offer.is_selected=1 AND  company_user_id IN ($idstr)";
        
        // perform query
        $connection = \Yii::$app->getDb ();
        $command = $connection->createCommand ( $query );
        $o = $command->queryAll ();
        // if result than return first element in array, otherwise return array avg => 0
        return $o ? $o [0] : [ 
                'avg' => 0 
        ];
    }
    
    /**
     * View action
     * @param integer $id Comment ID
     * @return object Comment
     */
    public function actionView($id) {
        $c = Comment::find ()->select ( [ 
                'comment.*',
                'general_rating' => 'general_rating(contact_rating, punctuality_rating, price_rating)' 
        ] )->where ( [ 
                'order_id' => $id 
        ] )->asArray ()->one ();
        if (! $c)
            return [ ];
        return $c;
    }
    
    /**
     * Create single comment
     *
     * @return object Comment
     */
    public function actionCreate() {
        // get post data
        if ($post = \Yii::$app->request->post ()) {
            // convert data from json to object
            $data = json_decode ( json_encode ( $post ) );
            
            $pur = $data->punctuality_rating;
            $oid = $data->order_id;
            
            if (! $offer = Offer::find ()->where ( [ 
                    'order_id' => $oid,
                    'is_selected' => 1 
            ] )->one ())
                return self::RESPONSE_ERR;
            
            $cid = $data->customer_id;
            $cr = $data->contact_rating;
            $pr = $data->price_rating;
            
            $cm = null;
            if (isset ( $data->comment ))
                $cm = $data->comment;
            $comment = Comment::findOne ( [ 
                    'order_id' => $oid,
                    'customer_id' => $cid 
            ] );
            if (! $comment) {
                $comment = new Comment ();
                $comment->order_id = $oid;
                $comment->customer_id = $cid;
            }
            $comment->comment = $cm;
            $comment->contact_rating = $cr;
            $comment->price_rating = $pr;
            $comment->punctuality_rating = $pur;
            
            // if comment is saved than create notification
            if ($offer && $comment->save ()) {
                $orderArray = Order::find ()->where ( "id=$oid" )->select ( 'order.id, order.user_id, order.title, order.from_city, order.to_city, order.from_country_short, order.to_country_short' )->asArray ()->one ();
                $n = new Notifications ();
                $n->category = Notifications::CAT_OFFER_RATED;
                $n->text = Helpers::getNotificationOrderText ( $orderArray );
                $n->user_id = $offer->company_user_id;
                $n->order_id = $oid;
                if (! $n->save ())
                    \Yii::error ( "didn't save notifications won offer oid: $oid", 'shipme' );
                
                return $comment;
            }
            // if something went wrong return bad request
            return self::RESPONSE_BAD_REQUEST;
        }
    }
    
    /**
     * Get list of comments of particular user
     * @param integer $uid User ID
     * @return array Comments
     */
    public function actionListByUser($uid = null) {
        // if user is not specified than set ID of current logged in user
        if (! $uid)
            $uid = \Yii::$app->user->id;
        return \app\models\Comment::find ()->select ( [ 
                'comment.*',
                'order.title',
                'general_rating' => 'general_rating(contact_rating, punctuality_rating, price_rating)' 
        ] )->innerJoin ( 'order', 'order.id=order_id' )->innerJoin ( 'user', 'user_id = user.id' )->where ( "user_id=$uid" )->asArray ()->all ();
    }
    
    /**
     * Get Comments of company
     * @param integer $cid Company ID
     * @return array Comments
     */
    public function actionListByCompany($cid) {
        if (! $cid)
            return [ ];
        
        // find all users of company
        $users = User::find ()->where ( "id_company_profile=$cid" )->asArray ()->all ();
        
        if (! $users)
            return [ ];
        
        // convert array to proper format
        $ids = Helpers::mapModel ( $users, 'id' );
        
        return \app\models\Comment::find ()->select ( [ 
                'comment.*',
                'order.title',
                'general_rating' => 'general_rating(contact_rating, punctuality_rating, price_rating)' 
        ] )->innerJoin ( 'order', 'order.id=order_id' )->innerJoin ( 'offer', 'offer.order_id = order.id' )->where ( [ 
                'offer.is_selected' => 1,
                'company_user_id' => $ids 
        ] )->asArray ()->all ();
    }
}

