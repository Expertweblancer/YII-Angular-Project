<?php

namespace app\controllers;

use app\components\BaseRestController;
use app\components\CustomCors;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\models\Offer;
use app\models\Order;
use app\models\Notifications;
use Codeception\Lib\Notification;
use app\helpers\Helpers;
use yii\helpers\ArrayHelper;

class OfferController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Offer';
    
    /**
     * Describe controller behaviours
     *
     * @return object Controller Behaviors
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
                        'index',
                        'view',
                        'get-offers',
                        'view-offer' 
                ],
                'class' => CompositeAuth::className (),
                'authMethods' => [ 
                        HttpBearerAuth::className () 
                ] 
        ];
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors ['authenticator'] ['except'] = [ 
                'options' 
        ];
        
        return $behaviors;
    }
    
    /**
     * Update Offer
     *
     * @return object Saved Offer
     */
    public function actionUpdateOffer() {
        if ($post = \Yii::$app->request->post ()) {
            // convert JSON to object
            $data = json_decode ( json_encode ( $post ) );
            
            // get current user
            $uid = \Yii::$app->user->id;
            
            $isNewOffer = false;
            $oid = $data->order_id;
            
            // try to find offer
            $offer = Offer::findOne ( [ 
                    'order_id' => $oid,
                    'company_user_id' => $uid 
            ] );
            // if not offer create one
            if (! $offer) {
                $offer = new Offer ();
                $offer->order_id = $oid;
                $offer->company_user_id = $uid;
                $isNewOffer = true;
            }
            
            // set date execution of offer
            $offer->date_execution = $data->date_execution;
            
            // set note
            if (isset ( $data->note ))
                $offer->note = $data->note;
            
            // set price
            $offer->your_price = $data->your_price;
            
            // set minimum price - not relevant now, used in future releases
            if (isset ( $data->min_price ))
                $offer->min_price = $data->min_price;
            
            // set car ID
            if (isset ( $data->car_id ))
                $offer->car_id = $data->car_id;
            
            // set updated to current timestamp
            $offer->date_updated = date ( "Y-m-d H:i:s" );
            
            // if offer save succesfully
            if ($offer->save ()) {
                // find order to offer than set notifications and send email
                
                $o = Order::find ()->where ( "order.id=$oid" )->select ( 'order.id, order.user_id, order.title, order.from_city, order.to_city, order.from_country_short, order.to_country_short, currency.name as cur_name' )->innerJoin ( 'currency', 'currency_id=currency.id' )->asArray ()->one ();
                
                // send notification to order creator
                $n = new Notifications ();
                $n->category = $isNewOffer ? Notifications::CAT_NEW_OFFER : Notifications::CAT_UPDATE_OFFER;
                $n->data = "$offer->your_price " . $o ['cur_name'];
                $n->text = Helpers::getNotificationOrderText ( $o );
                $n->user_id = $o ['user_id'];
                $n->order_id = $o ['id'];
                if (! $n->save ()) {
                    \Yii::error ( "didn't save notifications oid: $oid, uid: $uid errors:" . $n->errors, 'shipme' );
                }
                
                $other_offer = Offer::find ()->select ( 'company_user_id' )->where ( [ 
                        'order_id' => $oid 
                ] )->andWhere ( "company_user_id!=$uid AND your_price>$offer->your_price" )->limit ( 1 )->orderBy ( [ 
                        'your_price' => SORT_DESC 
                ] )->one ();
                
                // send notifications to competitor if new offer is with better price
                if ($other_offer) {
                    $competitor_notif = new Notifications ();
                    
                    $competitor_notif->category = Notifications::CAT_OFFER_PRICED;
                    $competitor_notif->data = "$offer->your_price " . $o ['cur_name'];
                    $competitor_notif->text = Helpers::getNotificationOrderText ( $o );
                    $competitor_notif->user_id = $other_offer->company_user_id;
                    $competitor_notif->order_id = $o ['id'];
                    if (! $competitor_notif->save ()) {
                        \Yii::error ( "didn't save notifications oid: $oid, uid: $uid errors:" . $n->errors, 'shipme' );
                    }
                } else {
                    // send email about new offer
                    $user = \app\models\User::find ()->select ( 'email, username' )->where ( [ 
                            'id' => $o ['user_id'] 
                    ] )->one ();
                    \Yii::$app->mailer->compose ( '@app/mail/first_offer_notification', [ 
                            'order' => $o,
                            'username' => $user->username 
                    ] )->setTo ( $user->email )->setFrom ( [ 
                            \Yii::$app->params ['adminEmail'] => \Yii::$app->name 
                    ] )->setSubject ( \Yii::t ( 'app', 'You have just got first offer to your order' ) )->send ();
                }
                return $offer;
            }
            return self::RESPONSE_BAD_REQUEST + [ 
                    'err' => $offer->errors,
                    'cuid' => $offer->company_user_id,
                    'offer' => $offer 
            ];
        }
        return [ ];
    }
    
    /**
     * Get Order Offer list
     *
     * @param integer $id Order ID
     * @return object[] Offer list
     */
    public function actionGetOffers($oid) {
        // create raw query
        $query = 'SELECT offer.*, company_profile.name AS company_name,
    			(SELECT AVG(general_rating(punctuality_rating, price_rating, contact_rating))
    				FROM `comment`
    				INNER JOIN `order` ON comment.order_id=order.id
    				INNER JOIN `offer` ON offer.order_id = order.id
    				WHERE offer.is_selected=1 AND company_user_id=user.id
    			) AS general_rating
    				FROM offer
    				INNER JOIN `user` ON user.id=offer.company_user_id
    				INNER JOIN company_profile ON company_profile.id=id_company_profile
    				WHERE order_id=' . $oid . ' ORDER BY `is_selected` DESC, `your_price`, `general_rating` DESC';
        $connection = \Yii::$app->getDb ();
        $command = $connection->createCommand ( $query );
        return $command->queryAll ();
    }
    
    /**
     * Get Won Order Offer
     *
     * @param integer $id Order ID
     * @return object Won Offer
     */
    public function actionGetWonOffer($oid) {
        // create raw query, select won offer
        $query = 'SELECT offer.*, company_profile.name AS company_name,
    			(SELECT AVG(general_rating(punctuality_rating, price_rating, contact_rating))
    				FROM `comment`
    				INNER JOIN `order` ON comment.order_id=order.id
    				INNER JOIN `offer` ON offer.order_id = order.id
    				WHERE offer.is_selected=1 AND company_user_id=user.id
    			) AS general_rating
    				FROM offer
    				INNER JOIN `user` ON user.id=offer.company_user_id
    				INNER JOIN company_profile ON company_profile.id=id_company_profile
    				WHERE order_id=' . $oid . ' AND `is_selected`=1';
        $connection = \Yii::$app->getDb ();
        $command = $connection->createCommand ( $query );
        $res = $command->queryAll ();
        
        // get return first element of array, where is stored won offer
        return $res [0];
    }
    
    /**
     * Get Order Offer
     *
     * @param integer $oid Order ID
     * @param integer $uid User ID
     * @return object Offer Object
     */
    public function actionViewOffer($oid, $uid) {
        return Offer::findOne ( [ 
                'order_id' => $oid,
                'user_id' => $uid 
        ] );
    }
    
    /**
     * Choose Order Offer
     *
     * @param integer $oid Order ID
     * @param integer $uid User ID
     * @return object Offer Object
     */
    public function actionChooseOffer($oid, $uid) {
        // find offer to set as won
        $offer = Offer::findOne ( [ 
                'order_id' => $oid,
                "company_user_id" => $uid 
        ] );
        
        if (! $offer)
            return self::RESPONSE_BAD_REQUEST + [ 
                    'oid' => $oid,
                    'cid' => $cid 
            ];
        
        // save info about offer selection
        $offer->is_selected = true;
        $offer->date_selected = date ( 'Y-m-d H:i:s' );
        if ($offer->save ( false )) {
            if (! $o = Order::findOne ( $oid ))
                return self::RESPONSE_BAD_REQUEST;
            
            $user = \app\models\User::findOne ( $o->user_id );
            
            // change status of order
            $o->status = 'awaiting';
            $arrayOrder = ArrayHelper::toArray ( $o );
            if ($o->save ()) {
                
                // notify user
                $n = new Notifications ();
                $n->category = Notifications::CAT_WON_OFFER;
                $n->text = Helpers::getNotificationOrderText ( $arrayOrder );
                $n->user_id = $offer->company_user_id;
                $n->order_id = $o->id;
                if (! $n->save ())
                    \Yii::error ( "didn't save notifications won offer oid: $oid, ofid:" . $n->errors, 'shipme' );
                
                // send email about offer won to offer company
                \Yii::$app->mailer->compose ( '@app/mail/win_notification', [ 
                        'order' => $o,
                        'username' => $offer->companyUser->username 
                ] )->setTo ( $offer->companyUser->email )->setFrom ( [ 
                        \Yii::$app->params ['adminEmail'] => \Yii::$app->name 
                ] )->setSubject ( \Yii::t ( 'app', 'Your offer has been selected' ) )->send ();
                $other_offers = Offer::find ()->select ( 'company_user_id' )->where ( "order_id=$oid AND company_user_id!=$uid" )->all ();
                
                // notify another offer companies about loosing their offer
                foreach ( $other_offers as $other_offer ) {
                    $competitor_notif = new Notifications ();
                    $competitor_notif->category = Notifications::CAT_OFFER_LOST;
                    $competitor_notif->text = Helpers::getNotificationOrderText ( $arrayOrder );
                    $competitor_notif->user_id = $other_offer->company_user_id;
                    $competitor_notif->order_id = $o ['id'];
                    if (! $competitor_notif->save ()) {
                        \Yii::error ( "didn't save notifications oid: $oid, uid: $uid errors:" . $n->errors, 'shipme' );
                    } else
                        \Yii::error ( "nobody to notify about better offer", 'shipme' );
                }
                return self::RESPONSE_OK;
            }
        }
        return self::RESPONSE_BAD_REQUEST + [ 
                'offer err' => $offer->errors,
                'offer' => $offer,
                'order err' => $o->errors 
        ];
    }
}