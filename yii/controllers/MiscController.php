<?php

namespace app\controllers;

use app\components\BaseRestController;
use app\components\CustomCors;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\models\FileForm;
use Yii;
use yii\debug\models\search\Log;
use app\models\UsersInvited;
use app\models\User;
use app\models\Order;
use app\models\CompanyProfile;
use app\models\Offer;
use app\helpers\Helpers;
use app\models\Comment;
use app\models\CustomerProfile;

class MiscController extends BaseRestController {
    // adjust the model class to match your model
    const LOGTYPE = 'rest-log';
    public $modelClass = 'app\models\CompanyProfile';
    
    /**
     * Describe controller behaviours
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
     * Unset unnecessary REST actions
     *
     * @return array Actions
     */
    public function actions() {
        $actions = parent::actions ();
        unset ( $actions ['index'] );
        unset ( $actions ['update'] );
        unset ( $actions ['create'] );
        unset ( $actions ['delete'] );
        return $actions;
    }
    
    /**
     * Get Info for Dashboard
     *
     * @return object Object with data
     */
    public function actionGetCustomerDashboardInfoBox() {
        $nc = Order::find ()->where ( [ 
                'status' => 'compleated',
                'user_id' => \Yii::$app->user->id 
        ] )->count ();
        $noo = Order::find ()->where ( [ 
                'status' => 'open',
                'user_id' => \Yii::$app->user->id 
        ] )->andWhere ( 'order.date_to>=CURDATE()' )->count ();
        return self::RESPONSE_OK + [ 
                'num_orders' => $noo,
                'num_to_pay' => 0,
                'num_orders_pending' => 0,
                'num_compleated' => $nc 
        ];
    }
    
    /**
     * Get menu status
     *
     * @param boolean $fc Is request from company profile
     *
     * @return object Object with menu data
     */
    public function actionOrderMenuStatus($fc) {
        $offering = $open = $awaiting = $executing = $invoices = 0;
        
        // if request is from company profile
        if ($fc) {
            // get number of offering orders
            $offering = Order::find ()->innerJoin ( 'offer', 'offer.order_id=order.id' )->where ( [ 
                    'order.status' => 'open',
                    'company_user_id' => \Yii::$app->user->id 
            ] )->count ();
            
            // get number of awaiting orders
            $awaiting = Order::find ()->innerJoin ( 'offer', 'offer.order_id=order.id' )->where ( [ 
                    'order.status' => 'awaiting',
                    'offer.is_selected' => 1,
                    'company_user_id' => \Yii::$app->user->id 
            ] )->andWhere ( 'order.date_to>=CURDATE()' )->count ();
            
            // get number of invoices
            $invoices = $order = Order::find ()->select ( 'offer.order_id, num, filename, comment,
								title, date_execution, from_country_short, to_country_short,
								from_address, from_city, to_city, to_address, invoices_manual.created' )->where ( [ 
                    'order.status' => 'compleated',
                    'offer.is_selected' => 1 
            ] )->andWhere ( 'company_user_id=' . \Yii::$app->user->id )->innerJoin ( 'offer', 'offer.order_id = order.id' )->leftJoin ( 'invoices_manual', 'order.id=invoices_manual.order_id' )->orderBy ( [ 
                    'created' => SORT_ASC 
            ] )->count ();
            
            // get number of executing orders
            $executing = Order::find ()->innerJoin ( 'offer', 'offer.order_id = order.id' )->where ( $where = "status='awaiting' AND date_execution=CURDATE() AND offer.is_selected=1 AND offer.company_user_id=" . \Yii::$app->user->id )->count ();
        } else {
            // if request is not from company but regullar user
            
            // get number of unpaid invoices
            $invoices = $order = Order::find ()->select ( 'offer.order_id, num, filename, comment,
								title, date_execution, from_country_short, to_country_short,
								from_address, from_city, to_city, to_address, invoices_manual.created' )->where ( [ 
                    'order.status' => 'compleated',
                    'offer.is_selected' => 1 
            ] )->andWhere ( 'order.user_id=' . \Yii::$app->user->id . " AND invoices_manual.created IS NOT NULL" )->innerJoin ( 'offer', 'offer.order_id = order.id' )->leftJoin ( 'invoices_manual', 'order.id=invoices_manual.order_id' )->orderBy ( [ 
                    'created' => SORT_ASC 
            ] )->count ();
            
            // get number of open orders
            $open = Order::find ()->where ( [ 
                    'status' => 'open',
                    'user_id' => \Yii::$app->user->id 
            ] )->andWhere ( 'order.date_to>=CURDATE()' )->count ();
            
            // get number of awaiting orders
            $awaiting = Order::find ()->where ( [ 
                    'status' => 'awaiting',
                    'user_id' => \Yii::$app->user->id 
            ] )->andWhere ( 'order.date_to>=CURDATE()' )->count ();
        }
        return [ 
                'num_offering' => $offering,
                'num_invoices' => $invoices,
                'num_open' => $open,
                'num_awaiting' => $awaiting,
                'num_executing' => $executing 
        ];
    }
    
    /**
     * Get Company Dashboard Info
     *
     * @return object Object with dashboard data
     */
    public function actionGetCompanyDashboardInfoBox() {
        $users = User::find ()->where ( [ 
                'id_company_profile' => \Yii::$app->user->identity->companyProfileId 
        ] )->all ();
        $ids = Helpers::mapModel ( $users, 'id' );
        
        $fleet = 0;
        // get number of compleated orders
        $orders = Order::find ()->where ( [ 
                'status' => 'compleated',
                'offer.is_selected' => 1,
                'offer.company_user_id' => $ids 
        ] )->innerJoin ( 'offer', 'offer.order_id=order.id' )->count ();
        
        // get value of income
        $income = Offer::find ()->where ( [ 
                'offer.is_selected' => 1,
                'company_user_id' => $ids,
                'status' => 'compleated' 
        ] )->innerJoin ( 'order', 'order.id=offer.order_id' )->sum ( 'your_price' );
        if (! $income)
            $income = 0;
        
        // get rating
        $rating = Comment::find ()->where ( [ 
                'offer.is_selected' => 1,
                'company_user_id' => $ids 
        ] )->innerJoin ( 'order', 'comment.order_id=order.id' )->innerJoin ( 'offer', 'offer.order_id = order.id' )->average ( 'general_rating(price_rating, contact_rating, punctuality_rating)' );
        if (! $rating)
            $rating = 0;
        return [ 
                'num_orders' => $orders,
                'num_fleet' => $fleet,
                'num_income' => $income,
                'num_rating' => $rating,
                'fad' => 'asddfsadf' 
        ];
    }
    
    /**
     * Get Trusted dashboard data
     *
     * @return object Object with dashboard data
     */
    public function actionGetTrusteeDashboardInfoBox() {
        // dashboard of Trustee to be done in the future
        return self::RESPONSE_OK + [ 
                'num_orders' => 0,
                'num_of_active' => 0 
        ];
    }
    
    /**
     * User search for trustee
     *
     * @return object[] Array Objects with user data
     */
    public function actionSearch() {
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            if (isset ( $data->text ) && ($text = $data->text)) {
                $o = Order::find ()->select ( [ 
                        'id',
                        'title' 
                ] )->where ( "`title` LIKE '%$text%'" )->asArray ()->all ();
            }
            // get user data
            $u = User::find ()->select ( '`username`, `email`, `name`, `surname`, `id` ' )->leftJoin ( CustomerProfile::className (), CustomerProfile::className () . '.user_id = user.id' )->where ( "email LIKE '%$text%' OR username LIKE '%$text%' OR name LIKE '%$text%' OR surname LIKE '%$text%'" )->asArray ()->all ();
            
            // get company data
            $c = CompanyProfile::find ()->select ( [ 
                    'name',
                    'id' 
            ] )->where ( "name LIKE '%$text%'" )->asArray ()->all ();
        }
        
        return [ 
                'orders' => $o,
                'users' => $u,
                'text' => $text,
                'companies' => $c 
        ] + self::RESPONSE_OK;
    }
    
    /**
     * Upload File
     *
     * @return object with succesfully uploaded file names
     */
    public function actionUploadFile($image = true) {
        Yii::trace ( 'upload image function start', $this::LOGTYPE );
        $finfo = finfo_open ( FILEINFO_MIME_TYPE );
        $fileNames = [ ];
        foreach ( $_FILES as $key => $file ) {
            Yii::trace ( 'filetype', finfo_file ( $finfo, $file ['tmp_name'] ) );
            if ($image) {
                // check if proper file name
                if (false === $ext = array_search ( finfo_file ( $finfo, $file ['tmp_name'] ), [ 
                        'jpg' => 'image/jpeg',
                        'png' => 'image/png',
                        'gif' => 'image/gif' 
                ], true ))
                    return self::RESPONSE_FILE_EXT_ERR + + [ 
                            'filetype' => finfo_file ( $finfo, $file ['tmp_name'] ) 
                    ];
            } else if (false === $ext = array_search ( finfo_file ( $finfo, $file ['tmp_name'] ), [ 
                    'jpg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'pdf' => 'application/pdf',
                    'xlsx' => "application/vnd.ms-excel",
                    'pptx' => "application/vnd.ms-powerpoint" 
            ], true ))
                return self::RESPONSE_FILE_EXT_ERR + [ 
                        'filetype' => finfo_file ( $finfo, $file ['tmp_name'] ) 
                ];
            
            if ($file ['size'] > \Yii::$app->params ['max_file_size']) {
                return self::RESPONSE_FILE_TOO_BIG;
            }
            
            // set random file name suffix
            $fileName = $image ? uniqid () . '.' . $ext : preg_replace ( '/\\.[^.\\s]{3,4}$/', '', $file ['name'] ) . uniqid () . '.' . $ext;
            
            Yii::trace ( 'filename:' . $fileName, $this::LOGTYPE );
            array_push ( $fileNames, $fileName );
            Yii::trace ( 'filename move files to the directory', $this::LOGTYPE );
            if (! move_uploaded_file ( $file ['tmp_name'], './upload/' . $fileName ))
                return self::RESPONSE_FILE_UPLOAD_ERR;
        }
        
        return self::RESPONSE_OK + [ 
                'fileNames' => $fileNames,
                'numoffiles' => count ( $_FILES ) 
        ];
    }
    public function actionDeleteImage($name) {
        // to be done
    }
    public function actionGetDashboardBoxData() {
        // to be done
    }
}
?>