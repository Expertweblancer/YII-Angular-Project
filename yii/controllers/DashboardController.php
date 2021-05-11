<?php

namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\components\BaseRestController;
use app\components\CustomCors;

class DashboardController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Dashboard';
    
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
}