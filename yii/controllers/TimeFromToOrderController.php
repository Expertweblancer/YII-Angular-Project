<?php

namespace app\controllers;

use yii\rest\ActiveController;
use app\components\CustomCors;
use app\models\TimeFromToOrder;

class TimeFromToOrderController extends ActiveController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\TimeFromToOrder';
    
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
        
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors ['authenticator'] = $auth;
        
        return $behaviors;
    }
    
    /*
     * Unset unnecessary REST actions
     *
     * @return array Actions
     */
    public function actions() {
        $actions = parent::actions ();
        unset ( $actions ['index'] );
        return $actions;
    }
    
    /*
     * Get Order Time
     * @param integer $id Order ID
     * @return array Order Time
     */
    public function actionIndex($id) {
        $model = TimeFromToOrder::findAll ( [ 
                'id_order' => $id 
        ] );
        return $model;
    }
}