<?php

namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\components\BaseRestController;
use app\components\CustomCors;
use app\models\User;
use Yii;
use app\models\UsersInvited;
use yii\filters\VerbFilter;

class UsersInviteController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\UsersInvite';
    
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
                'except' => [ 
                        'get-info' 
                ],
                'class' => CompositeAuth::className (),
                'authMethods' => [ 
                        HttpBearerAuth::className () 
                ] 
        ];
        
        $behaviors ['verbs'] = [ 
                'class' => VerbFilter::className () 
        ];
        return $behaviors;
    }
    
    /*
     * Get list of invited users
     *
     * @return object[] List of invited users
     */
    public function actionGetInvitedUserList() {
        if (! $cid = \Yii::$app->user->identity->getCompanyProfileId ()) {
            return [ ];
        }
        
        $connection = \Yii::$app->getDb ();
        $command = $connection->createCommand ( "SELECT DATE_FORMAT(created, '%d-%m-%Y') as created, `email` FROM `users_invited` 
				WHERE `email` NOT IN (SELECT `email` FROM `user`) 
				AND id_company_profile = $cid ORDER BY `users_invited`.`created` DESC" );
        
        return $command->queryAll ();
    }
    
    /*
     * Get list of company users
     *
     * @return object[] List of company users
     */
    public function actionGetCompanyUserList() {
        if (! $cid = \Yii::$app->user->identity->getCompanyProfileId ())
            return [ ];
        return User::find ()->where ( "id_company_profile=$cid" )->asArray ()->all ();
    }
    
    /*
     * Get list of invited users
     *
     * @return object[] List of invited users
     */
    public function actionGetInfo($t) {
        if ($u = UsersInvited::findValidByTokenArray ( $t ))
            return $u + self::RESPONSE_OK;
        return self::RESPONSE_MODEL_NOT_FOUND + [ 
                'token' => $t 
        ];
    }
    
    /*
     * Invite user using email
     *
     * @return object[] List of invited users
     */
    public function actionInviteEmail() {
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            if (! $company_id = \Yii::$app->user->identity->getCompanyProfileId ())
                return self::RESPONSE_NO_PERMISSION;
            
            if (! isset ( $data->return_url ) || ! isset ( $data->email ))
                return self::RESPONSE_BAD_REQUEST;
            $returnUrl = $data->return_url;
            
            $name = null;
            if (isset ( $data->name ))
                $name = $data->name;
            $surname = null;
            if (isset ( $data->surname ))
                $surname = $data->surname;
            
            $phone = null;
            if (isset ( $data->phone ))
                $phone = $data->phone;
            
            $email = $data->email;
            $u = User::findOne ( [ 
                    'email' => $email 
            ] );
            if ($u) {
                if ($u->id_company_profile)
                    return self::RESPONSE_EMAIL_ALREADY_EXISTS;
                $u->id_company_profile = $company_id;
                $u->save ( false );
                return self::STATUS_FALSE + [ 
                        'response' => 'User already registered, just adding to profile',
                        'email' => $email 
                ];
            }
            
            $ui = UsersInvited::findOne ( [ 
                    'email' => $email 
            ] );
            $response = [ ];
            if (! $ui) {
                $ui = new UsersInvited ();
                $ui->email = $email;
                $response = [ 
                        'response' => 'New user' 
                ];
            } else
                $response = [ 
                        'response' => 'Already invited' 
                ];
            
            $token = uniqid ();
            $ui->name = $name;
            $ui->surname = $surname;
            $ui->phone = $phone;
            $ui->id_company_profile = $company_id;
            $ui->token = $token;
            $ui->save ();
            \Yii::$app->mailer->compose ( '@app/mail/invite', [ 
                    'email' => $email,
                    'return_url' => $returnUrl,
                    'token' => $token 
            ] )->setFrom ( [ 
                    \Yii::$app->params ['adminEmail'] => Yii::t ( 'app', 'Transovia admin' ) 
            ] )->setTo ( $email )->setSubject ( Yii::t ( 'app', 'You have been invited to Transovia App' ) )->send ();
            
            return self::STATUS_TRUE + $ui->toArray () + $response + [ 
                    'error' => $ui->errors 
            ];
        } else
            return self::RESPONSE_NO_POST_VALUE;
    }
}

