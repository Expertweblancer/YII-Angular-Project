<?php

namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\components\BaseRestController;
use app\components\CustomCors;
use app\models\User;
use yii\filters\AccessControl;

class AdminController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\User';
    
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
        
        $behaviors ['access'] = [ 
                'class' => AccessControl::className (),
                'rules' => [ 
                        [ 
                                'allow' => true,
                                'roles' => [ 
                                        'admin' 
                                ] 
                        ] 
                ] 
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
        unset ( $actions ['create'] );
        unset ( $actions ['update'] );
        unset ( $actions ['view'] );
        unset ( $actions ['update'] );
        return $actions;
    }
    
    /**
     * Get User List Rest Api Function
     *
     * @return user list without passwords, and other sensitive data
     */
    public function actionGetUserList() {
        return User::find ()->select ( 'user.id, user.created_at, user.confirmed_at, 
					user.username, user.email, user.last_login_at, user.id_company_profile' )->asArray ()->all ();
    }
}

