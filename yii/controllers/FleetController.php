<?php

namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\VerbFilter;
use app\components\BaseRestController;
use app\components\CustomCors;
use app\models\User;
use Yii;
use app\models\Fleet;
use app\models\Order;
use yii\web\BadRequestHttpException;

class FleetController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Fleet';
    
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
     * @return actions array
     */
    public function actions() {
        $actions = parent::actions ();
        unset ( $actions ['index'] );
        unset ( $actions ['delete'] );
        return $actions;
    }
    
    /**
     * Get list of cars
     *
     * @return object[] List of cars
     */
    public function actionIndex() {
        \Yii::trace ( 'id_company ' . \Yii::$app->user->identity->getCompanyProfileId (), 'shipme' );
        
        // if logged user belongs to company, then return company's cars
        if (\Yii::$app->user->identity->getCompanyProfileId ())
            return Fleet::find ()->select ( 'currency.short AS curr_short, fleet.*' )->where ( [ 
                    'id_company_profile' => \Yii::$app->user->identity->getCompanyProfileId () 
            ] )->innerJoin ( 'company_profile', 'company_profile.id=id_company_profile' )
            ->innerJoin ( 'currency', 'currency.id=currency_id' )->asArray ()->all ();
        return [ ];
    }
    
    /**
     * Delete car
     * @param integer $id Id of fleet
     * @return object with response
     */
    public function actionDeleteFleet($id) {
        if (Fleet::deleteAll ( "id = $id" ))
            return self::RESPONSE_OK;
        return self::RESPONSE_MODEL_NOT_FOUND;
    }
    
    /**
     * Get order history of fleet
     * @param integer $fid ID of Fleet
     * @return object[] List of Fleet
     */
    public function actionGetHistory($fid) {
        return Order::find ()->select ( 'order.title, order.from_city, order.from_country_short, order.to_city, order.to_country_short, offer.date_execution, order.category_id, order.distance' )->where ( [ 
                'car_id' => $fid,
                'offer.is_selected' => 1 
        ] )->innerJoin ( 'offer', 'offer.order_id = order.id' )->asArray ()->all ();
    }
    
    /**
     * Edit Car Data
     *
     * @return object with response
     */
    public function actionEditFleet() {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            if (! isset ( $data->id ))
                throw new BadRequestHttpException ();
            
            if (! $model = Fleet::findOne ( $data->id ))
                return self::RESPONSE_MODEL_NOT_FOUND;
            if ($model->id_company_profile !== \Yii::$app->user->identity->getCompanyProfileId ())
                return self::RESPONSE_MODEL_NOT_FOUND;
            foreach ( $data as $key => $el ) {
                $model->{$key} = $el;
            }
            if ($model->save ())
                return $model;
            
            //if fleet was not saved than throw exception
            throw new BadRequestHttpException ();
        }
    }

    /**
     * Filter Fleet
     *
     * @return object[] Filtered fleet
     */
    public function actionFilter() {
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            
            // set some variables so they are known to compiler later
            $longest_side = $max_kg = $categories = $name = null;
            
            // init where with company_profile
            $where = 'id_company_profile=' . \Yii::$app->user->identity->companyProfileId;
            \Yii::trace ( 'where:' . $where, "shipme" );
            
            // filter by fleet name
            if (isset ( $data->name ))
                $name = $data->name;
            
            // filter by fleet categories
            if (isset ( $data->categories ))
                $categories = $data->categories;
            
            // filter by maximum weight to load
            if (isset ( $data->max_kg ))
                $max_kg = $data->max_kg;
            
            // filter by longest side of fleet
            if (isset ( $data->longest_side ))
                $longest_side = $data->longest_side;
            
            //build query
            if ($longest_side)
                $where .= " AND longest_side(loading_length, loading_width) >= $longest_side";
            if ($name)
                $where .= " AND `fleet`.`name` LIKE '%$name%'";
            if ($max_kg)
                $where .= " AND `max_kg`>=$max_kg";
            if ($categories) {
                $ids = [ ];
                $or = null;
                foreach ( $categories as $cat ) {
                    if (! $or)
                        $or = "(id_category=$cat->id";
                    else
                        $or .= " OR id_category=$cat->id";
                }
                
                if ($or)
                    $or .= ")";
                \Yii::trace ( 'where:' . $where + ' -- ' + $or );
                return Fleet::find ()->select ( 'fleet.*' )->distinct ( 'fleet.id' )->innerJoin ( 'fleet_order_categories', 'id_fleet=fleet.id' )
                    ->where ( $where )->andWhere ( $or )->asArray ()->all ();
            } else
                return Fleet::find ()->select ( 'currency.short AS curr_short, fleet.*' )->innerJoin ( 'company_profile', 'company_profile.id=id_company_profile' )
                            ->innerJoin ( 'currency', 'currency.id=currency_id' )->where ( $where )->asArray ()->all ();
        }
        throw new BadRequestHttpException ();
    }
}

