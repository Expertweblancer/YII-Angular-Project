<?php

namespace app\controllers;

use app\components\BaseRestController;
use app\components\CustomCors;
use app\models\Currency;

class CurrencyController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Currency';
    
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
        return $a;
    }
    
    /**
     * Get List of currencies
     *
     * @return object[] Currency list
     */
    public function actionIndex() {
        return Currency::find ()->all ();
    }
}

