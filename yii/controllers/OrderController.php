<?php

namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\models\Order;
use app\components\CustomCors;
use app\models\User;
use app\components\BaseRestController;
use app\models\OrderTime;
use app\models\Parcel;
use app\models\Offer;
use app\helpers\Helpers;
use app\models\CustomerProfile;
use app\models\Country;
use app\models\Notifications;
use yii\helpers\ArrayHelper;

class OrderController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Order';
    
    /*
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
                'class' => CompositeAuth::className (),
                'authMethods' => [ 
                        HttpBearerAuth::className () 
                ] 
        ];
        
        $behaviors ['verbs'] = [ 
                'class' => \yii\filters\VerbFilter::className (),
                'actions' => [ 
                        'update' => [ 
                                'patch',
                                'put' 
                        ] 
                
                ] 
        ];
        
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors ['authenticator'] ['except'] = [ 
                'options' 
        ];
        return $behaviors;
    }
    
    /*
     * Unset unnecessary REST actions
     *
     * @return array Actions
     */
    public function actions() {
        $a = parent::actions ();
        unset ( $a ['delete'] );
        unset ( $a ['view'] );
        
        return $a;
    }
    
    /*
     * Get Order Attachments
     *
     * @param integer $id Order ID
     * @return object Order Object
     */
    public function actionView($id, $token = null) {
        // token to be implemented in future released
        $order = Order::findOne ( [ 
                'id' => $id 
        ] );
        return $order;
    }
    
    /*
     * Get Date of Order Modification
     *
     * @param integer $id Order ID
     * @return object Object with date of modification
     */
    public function actionGetDateModified($oid) {
        $o = Order::findOne ( $oid );
        
        if ($o)
            return [ 
                    'date_modified' => $o->date_modified 
            ];
        return [ ];
    }
    
    /*
     * Get Order Attachments
     *
     * @param integer $id Order ID
     * @return object Order Object
     */
    public function actionChangeStatus($id, $status) {
        $o = Order::findOne ( $id );
        if (! $o /*|| (\Yii::$app->user->id != $o->user_id && !\Yii::$app->user->identity->isTrustee)*/)
    		return self::RESPONSE_NO_PERMISSION + [ 
                    'uid' => \Yii::$app->user->id,
                    'ouid' => $o->user_id 
            ];
        
        $o->status = $status;
        if ($o->save ()) {
            if ($status == 'compleated') {
                $n = new Notifications ();
                $n->category = Notifications::CAT_ORDER_COMPLEATED;
                $n->text = Helpers::getNotificationOrderText ( ArrayHelper::toArray ( $o ) );
                $n->user_id = $o->user_id;
                $n->order_id = $o->id;
                
                if (! $n->save ())
                    \Yii::error ( "didn't save notifications won offer oid: $oid, ofid:" . $offer->company_user_id . ", errors: ", 'shipme' );
            }
            return self::RESPONSE_OK;
        }
        return self::RESPONSE_BAD_REQUEST + [ 
                'err' => $o->errors 
        ];
    }
    
    /*
     * Delete Order, mark as deleted
     *
     * @param integer $id Order ID
     * @return object Action Status
     */
    public function actionDelete($id) {
        $o = Order::findOne ( $id );
        if (! $o)
            return self::RESPONSE_BAD_REQUEST;
        // mark as deleted
        $o->is_deleted = true;
        if ($o->save ())
            return self::RESPONSE_OK;
        
        return self::RESPONSE_BAD_REQUEST;
    }
    
    /*
     * Set order as compleated
     *
     * @param integer $id Order ID
     * @return object Action Status
     */
    public function actionComplete($id) {
        $o = Order::findOne ( $id );
        if (! $o)
            return self::RESPONSE_BAD_REQUEST;
        
        $o->is_completed = true;
        if ($o->save ()) {
            return self::RESPONSE_OK;
        }
        return self::RESPONSE_BAD_REQUEST;
    }
    
    /*
     * Change Order Active status
     *
     * @param integer $id Order ID
     * @param boolean $active Status if is active true or false
     * @return object Action Status
     */
    public function actionChangeOrderActive($id, $active) {
        $o = Order::findOne ( [ 
                'id' => $id,
                'user_id' => \Yii::$app->user->id 
        ] );
        if ($o) {
            $o->is_active = $active;
            $o->save ();
            return self::STATUS_TRUE;
        }
        return self::RESPONSE_MODEL_NOT_FOUND;
    }
    
    /*
     * Get order owner
     *
     * @param integer $id Order ID
     * @return object Object with user data
     */
    public function actionGetUserByOrderId($id) {
        $u = [ ];
        $o = Order::findOne ( $id );
        if ($o)
            $u = User::find ()->select ( [ 
                    'id',
                    'email',
                    'name',
                    'surname',
                    'phone_num' 
            ] )->leftJoin ( 'customer_profile', 'id=user_id' )->where ( [ 
                    'id' => $o->user_id 
            ] )->asArray ()->one ();
        
        return $u;
    }
    
    /*
     * Change Order Active status
     *
     * @param string $status Status of order
     * @return object Action Status
     */
    public function actionGetNumOfOrders($status = null) {
        $uid = \Yii::$app->user->id;
        if ($status)
            $num = Order::find ()->where ( "`status`='$status' AND `user_id`=$uid" )->count ();
        else
            $num = Order::find ()->where ( "`user_id`=$uid" )->count ();
        
        return self::RESPONSE_OK + [ 
                'num' => $num 
        ];
    }
    
    /*
     * Get orders using filter
     *
     * @param boolean $fromCompany If request is from company
     * @return object[] List of filtered orders
     */
    public function actionFilterOrders($fromCompany = false) {
        $uid = \Yii::$app->user->id;
        // if is from company but no company profile, than error
        if ($fromCompany && ! \Yii::$app->user->identity->hasCompanyProfile)
            return self::RESPONSE_BAD_REQUEST + [ 
                    'error' => 'request for company but not company profile',
                    'pid' => \Yii::$app->user->identity->companyProfileId 
            ];
        
        $temp; // delete that temp
               
        // we dont want to have deleted orders
        $where = "`is_deleted`=0 AND `is_active`=1";
        $categories = "";
        $dates = '';
        $having = '';
        $distance = '';
        $innerJoin = "";
        $ownerId = null;
        $sort = "ORDER BY order.date_added DESC";
        
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            //build order filter WHERE part of query
            
            //if set index than we want orders that are grater than that integer index
            if (isset ( $data->index ))
                $where .= " AND id>" . $data->index;
            
            // set sort ASC or DESC
            if (isset ( $data->sort )) {
                if ($data->sort == "asc")
                    $sort = "ORDER BY order.date_added ASC";
            }
            $todayStr = date ( "Y-m-d", time () );
            
            // if user is trustee select all order ids that are owned by trustee
            if (! $fromCompany && \Yii::$app->user->identity->isTrustee) {
                $trusteeOwningUsers = CustomerProfile::find ()->select ( 'user_id AS id' )->where ( 'trustee_id IS NOT NULL' )->asArray ()->all ();
                if (count ( $trusteeOwningUsers ) > 0)
                    $ownerId = ' AND order.user_id IN (' . Helpers::getIdsStr ( $trusteeOwningUsers, 'id' ) . ')';
                else
                    return [ ]; // no point to look if trustee has no any users
            } else if (! $fromCompany)
                // if from customer user, than put user id as order.user_id
                $ownerId = ' AND user_id = ' . \Yii::$app->user->id;
            
            // if category id is set, than filter with searched category
            if (isset ( $data->category_id ) && $data->category_id > 0) {
                $where .= " AND `category_id` = $data->category_id";
            }
            // set status, if no status is set than we want all open orders
            $status = isset ( $data->status ) ? $data->status : 'open';
            
            // now check what is the status and build query according to that status
            switch ($status) {
                // if want deleted order
                case 'deleted' :
                    $where .= " AND `is_deleted`=1";
                    break;
                // if want offering orders
                case 'offering' :
                    $innerJoin = "INNER JOIN offer ON offer.order_id=order.id";
                    $where = "status='open' AND offer.company_user_id=$uid";
                    break;
                // if want executing orders
                case 'executing' :
                    $innerJoin = "INNER JOIN offer ON offer.order_id=order.id";
                    if ($fromCompany)
                        $where = "status='awaiting' AND date_execution=CURDATE() AND offer.is_selected=1 AND offer.company_user_id=$uid";
                    else
                        $where .= " AND status='awaiting' AND date_execution=CURDATE()";
                    break;
                //if want open orders
                case 'open' :
                    $R = 6371; // Radius of earth
                    $where .= " AND status='open' AND (offer.is_selected IS NULL OR offer.is_selected=0)";
                    $innerJoin = "LEFT JOIN offer ON offer.order_id=order.id";
                    // init variables
                    $fromCountry = '';
                    $toCountry = '';
                    $from_lat = $from_lng = $to_lat = $to_lng = $radius = $range_date = $place = $origin_dest = '';
                    
                    // init variable and set default value;
                    $dates = 'AND date_to >= CURDATE()';
                    
                    // first prepare categories query
                    if (isset ( $data->categories ) && count ( $data->categories ) > 0) {
                        $catstr = '';
                        $c = count ( $data->categories );
                        for($i = 0; $i < $c; $i ++) {
                            $catstr .= $data->categories [$i];
                            if ($i < $c - 1)
                                $catstr .= ', ';
                        }
                        $categories = "AND category_id IN ($catstr)";
                    }
                    
                    if (isset ( $data->range_date )) {
                        $range_date = $data->range_date;
                        $rangeArr = explode ( ' - ', $range_date );
                        
                        $range_date_since = date ( "Y-m-d", strtotime ( $rangeArr [0] ) );
                        $range_date_to = date ( "Y-m-d", strtotime ( $rangeArr [1] ) );
                        $dates = "AND date_from>='$range_date_since' AND date_to<='$range_date_to'";
                        ;
                    }
                    
                    // place search
                    if (((isset ( $data->start_lat ) && isset ( $data->start_lng )) || (isset ( $data->end_lat ) && isset ( $data->end_lng ))) && isset ( $data->radius )) {
                        $radius = $data->radius;
                        $column_prefix = '';
                        
                        if (isset ( $data->start_lat ) && isset ( $data->start_lng )) {
                            $column_prefix = 'from';
                            $lat = $data->start_lat;
                            $lng = $data->start_lng;
                        }
                        if (isset ( $data->end_lat ) && isset ( $data->end_lng )) {
                            $column_prefix = 'to';
                            $lat = $data->end_lat;
                            $lng = $data->end_lng;
                        }
                        $distance = "( $R * ACOS(
						COS( RADIANS( $lat ) ) *
						COS( RADIANS( `" . $column_prefix . "_lat` ) ) *
								COS(RADIANS( `" . $column_prefix . "_long` ) - RADIANS( $lng )) +
								SIN(RADIANS($lat)) * SIN(RADIANS(`" . $column_prefix . "_lat`)))) AS `radius`, ";
                        
                        $having = "HAVING `radius` <= $radius";
                    }
                    
                    // route
                    if (isset ( $data->start_lat ) && isset ( $data->start_lng ) && isset ( $data->end_lat ) && isset ( $data->end_lng ) && isset ( $data->distance )) {
                        $from_lat = $data->start_lat;
                        $from_lng = $data->start_lng;
                        $to_lat = $data->end_lat;
                        $to_lng = $data->end_lng;
                        $distance = $data->distance;
                        
                        $path1 = "( $R * ACOS(
						COS( RADIANS( $from_lat ) ) *
						COS( RADIANS( `from_lat` ) ) *
								COS(RADIANS( `from_long` ) - RADIANS( $from_lng )) +
								SIN(RADIANS($from_lat)) * SIN(RADIANS(`from_lat`))))";
                        $path2 = "( $R * ACOS(
						COS( RADIANS( `to_lat` ) ) *
						COS( RADIANS( `from_lat` ) ) *
						COS(RADIANS( `from_long` ) - RADIANS( `to_long` )) +
						SIN(RADIANS(`to_lat`)) * SIN(RADIANS(`from_lat`))))";
                        
                        $path3 = "( $R * ACOS(
						COS( RADIANS( $to_lat ) ) *
						COS( RADIANS( `to_lat` ) ) *
						COS(RADIANS( `to_long` ) - RADIANS( $to_lng )) +
						SIN(RADIANS($to_lat)) * SIN(RADIANS(`to_lat`))))";
                        
                        $distance = "filter_distance($path1, `distance`/1000, $path3, $distance/1000*1.1) as is_in_range, ";
                        $having = 'HAVING `is_in_range`=1';
                    }
                    
                    // country filter
                    if ((isset ( $data->to_country_id ) && $data->to_country_id > 0) || (isset ( $data->from_country_id ) && $data->from_country_id > 0)) {
                        if (isset ( $data->from_country_id ) && $data->from_country_id > 0) {
                            $country = Country::findOne ( $data->from_country_id );
                            $short = strtolower ( $country->code );
                            $fromCountry = "AND from_country_short='$short'";
                        }
                        
                        if (isset ( $data->to_country_id ) && $data->to_country_id > 0) {
                            $country = Country::findOne ( $data->to_country_id );
                            $short = strtolower ( $country->code );
                            $toCountry = "AND to_country_short='$short'";
                        }
                        $where .= " $fromCountry $toCountry";
                    }
                    if (isset ( $data->date_execution )) {
                        $date = $data->date_execution;
                        $dates = " AND date_from<='$date' AND date_to>='$date'";
                    }
                    
                    break;
                // get compleated orders
                case 'compleated' :
                    $innerJoin = "LEFT JOIN offer ON offer.order_id=order.id";
                    if ($fromCompany)
                        $where .= " AND status='compleated' AND offer.company_user_id=$uid AND offer.is_selected=1";
                    else
                        $where .= " AND status='compleated'";
                    break;
                    
                //get unrealized orders
                case 'unrealized' :
                    $innerJoin = "LEFT JOIN offer ON offer.order_id=order.id";
                    if ($fromCompany)
                        $where .= " AND status!='compleated' AND date_to < CURDATE() AND offer.company_user_id=$uid";
                    else
                        $where .= " AND status!='compleated' AND date_to < CURDATE()";
                    break;
                    
                //get awaiting orders
                case 'awaiting' :
                    $innerJoin = "INNER JOIN offer ON offer.order_id=order.id";
                    if ($fromCompany)
                        $where = "status='awaiting' AND order.date_to>='$todayStr' AND offer.is_selected=1 AND offer.company_user_id=$uid";
                    else
                        $where .= " AND status='awaiting' AND order.date_to>='$todayStr'";
                    break;
                case $status != 'all' :
                    $where .= " AND `status`='$status'";
                    break;
            }
            
            // if order name is specified, than fiter by name
            if (isset ( $data->name )) {
                $where .= " AND `title`LIKE'%$data->name%'";
            }
            
            // filter by country short
            if (isset ( $data->filterFromAddressModel ) && isset ( $data->filterFromAddressModel->city )) {
                $country = $data->filterFromAddressModel->country_short;
                $city = $data->filterFromAddressModel->city;
                
                $where .= " AND `from_country_short`='$country' AND `from_city`='$city'";
            }
            
            // filter by city
            if (isset ( $data->filterToAddressModel ) && isset ( $data->filterToAddressModel->city )) {
                $country = $data->filterToAddressModel->country_short;
                $city = $data->filterToAddressModel->city;
                
                $where .= " AND `to_country_short`='$country' AND `to_city`='$city'";
            }
        }
        
        // build raw query
        $query = "SELECT DISTINCT (order.id), $distance (SELECT COUNT(*) FROM offer WHERE offer.order_id=order.id) AS num_offers, 
			    (SELECT your_price FROM offer WHERE offer.order_id=order.id ORDER BY your_price ASC LIMIT 1) AS best_price, 
				order.title, `status`, `token`, trustee_id, title, category_id, from_city, from_country_short, 
				from_address, date_from, to_city, to_address, currency_id,
				to_country_short, distance, info, date_to, is_completed, is_deleted, order.date_added
				FROM `order` $innerJoin WHERE $where $categories $dates $ownerId $having $sort";
        
        \Yii::info ( 'Query ------- ' . $query, 'shipme_test' );
        $connection = \Yii::$app->getDb ();
        $command = $connection->createCommand ( $query );
        $o = $command->queryAll ();
        
        
        // add parcels and offers to all found orders
        for($i = 0; $i < count ( $o ); $i ++) {
            $parcels = Parcel::findAll ( [ 
                    'order_id' => $o [$i] ['id'] 
            ] );
            
            $mw = 0;
            $md = 0;
            $mh = 0;
            $tw = 0;
            
            foreach ( $parcels as $p ) {
                $mw += $p->width;
                $md += $p->depth;
                $mh += $p->height;
                $tw += $p->weight;
            }
            
            //add offers
            $offers = Offer::find ()->select ( 'offer.*, company_profile.name as company_name' )->where ( [ 
                    "order_id" => $o [$i] ['id'] 
            ] )->orderBy ( [ 
                    'your_price' => SORT_ASC 
            ] )->innerJoin ( 'user', 'user.id=offer.company_user_id' )->innerJoin ( 'company_profile', 'company_profile.id=user.id_company_profile' )->asArray ()->all ();
            $o [$i] = $o [$i] + [ 
                    'max_depth' => $md,
                    'max_width' => $mw,
                    'max_height' => $mh,
                    'total_weight' => $tw 
            ] + [ 
                    'query' => $where 
            ] + [ 
                    'offers' => $offers 
            ];
        }
        
        return $o;
    }
}