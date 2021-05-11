<?php

namespace app\controllers;

use yii\rest\ActiveController;
use app\components\CustomCors;
use yii\filters\VerbFilter;

class AddressController extends ActiveController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Address';
    
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
        
        $behaviors ['verbs'] = [ 
                'class' => VerbFilter::className () 
        ];
        
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors ['authenticator'] = $auth;
        
        return $behaviors;
    }
}