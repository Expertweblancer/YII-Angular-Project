<?php

namespace app\controllers;

use app\components\BaseRestController;
use app\components\CustomCors;
use app\models\PaymentTypes;

class PaymentTypesController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\PaymentTypes';
    
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
        
        return $behaviors;
    }
    
    /*
     * Unset unnecessary REST actions
     *
     * @return array Actions
     */
    public function actions() {
        $a = parent::actions ();
        unset ( $a ['index'] );
        unset ( $a ['delete'] );
        unset ( $a ['update'] );
        unset ( $a ['create'] );
        unset ( $a ['view'] );
        return $a;
    }
    
    /*
     * Get List of Payment Types
     *
     * @param string $lang Language code
     * @return array Actions
     */
    public function actionList($lang) {
        $retVal = [ ];
        // get payment types
        $payments = PaymentTypes::find ()->all ();
        
        // translate payment types
        foreach ( $payments as $p ) {
            $val = null;
            $val ['id'] = $p->id;
            $val ['name'] = \Yii::t ( 'app', $p->name, null, $lang );
            array_push ( $retVal, $val );
        }
        return $retVal;
    }
    
    /*
     * Get Payment Type
     *
     * @param integer $id Payment Type ID
     * @param string $lang Language code
     * @return array Actions
     */
    public function actionOne($id, $lang) {
        $val = null;
        $p = PaymentTypes::findOne ( $id );
        
        // translate payment type
        $val ['id'] = $p->id;
        $val ['name'] = \Yii::t ( 'app', $p->name, null, $lang );
        return $val;
    }
}

