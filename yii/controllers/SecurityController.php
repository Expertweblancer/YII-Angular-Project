<?php

namespace app\controllers;

use app\models\User;
use dektrium\user\helpers\Password;
use app\models\RestUser;
use Yii;
use app\components\BaseRestController;
use app\components\CustomCors;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\VerbFilter;
use app\models\UsersInvited;
use app\helpers\Security;
use app\models\CustomerProfile;
use app\helpers\Helpers;
use app\models\Order;
use yii\web\BadRequestHttpException;

class SecurityController extends BaseRestController {
    const LOGTYPE = 'rest-log';
    
    // adjust the model class to match your model
    public $modelClass = 'app\models\RestUser';
    
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
                        'login',
                        'register',
                        'register-invited',
                        'reset-password-request',
                        'confirm-email',
                        'resend',
                        'logout',
                        'change-password-reset',
                        'check-email-exists',
                        'check-username-exists' 
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
     * Login User, check username and password
     *
     * @return object Object containing AUTH_KEY, and user info
     */
    public function actionLogin() {
        \Yii::trace ( 'action login!', 'shipme' );
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        
        if ($post = \Yii::$app->request->post ()) {
            $authData = json_decode ( json_encode ( $post ) );
            
            // check validation of data
            if (! isset ( $authData->username ) || ! isset ( $authData->password ))
                return self::RESPONSE_BAD_REQUEST + [ 
                        'msg' => 'no username or and password' 
                ];
            
            $passwordHash = Helpers::getPasswordHash ( $authData->password );
            $username = $authData->username;
            
            // find user
            $user = User::find ()->where ( [ 
                    'username' => $username 
            ] )->one ();
            if (! $user) {
                $user = User::find ()->where ( [ 
                        'email' => $username 
                ] )->one ();
            }
            
            if (! $user)
                return self::RESPONSE_USER_DOES_NOT_EXISTS;
            if (! $user->confirmed_at)
                return self::RESPONSE_EMAIL_NOT_CONFIRMED;
            
            // check password
            if (password_verify ( $authData->password, $user->password_hash )) {
                $user->auth_key = \Yii::$app->security->generateRandomString ();
                $user->last_login_at = time ();
                // get user info
                if ($user->save ())
                    return self::RESPONSE_OK + Security::getUserInfo ( $user ) + [ 
                            'login_time' => date ( "F j, Y, g:i a", $user->last_login_at ),
                            'ph' => $passwordHash 
                    ];
            } else
                return self::RESPONSE_ERR;
        }
        throw new BadRequestHttpException ();
    }
    
    /*
     * Get Users Profile
     *
     * @return object Object Profile of user
     */
    public function actionGetProfileUser() {
        return User::find ()->select ( 'username, email' )->where ( 'id=' . \Yii::$app->user->id )->one ();
    }
    
    /*
     * Get Users Profile
     *
     * @return object Object Profile of user
     */
    public function actionSetProfile($uid, $pid) {
        $u = User::findOne ( $uid );
        if ($u) {
            $u->id_company_profile = $pid;
            if ($u->save ())
                return self::RESPONSE_OK;
        }
        return self::RESPONSE_BAD_REQUEST;
    }
    
    /*
     * Register by Trustee
     *
     * @return object Action Status
     */
    public function actionTrusteeRegister() {
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            
            $email = User::find ()->where ( [ 
                    'email' => $data->email 
            ] )->one ();
            $username = User::find ()->where ( [ 
                    'username' => $data->username 
            ] )->one ();
            if ($username && $email)
                return [ 
                        'status' => false,
                        'response' => 'email and username exists',
                        'username' => $data->username,
                        'email' => $data->email 
                ];
            if ($username)
                return [ 
                        'status' => false,
                        'response' => 'username exists',
                        'username' => $data->username,
                        'email' => $data->email 
                ];
            if ($email)
                return [ 
                        'status' => false,
                        'response' => 'email exists',
                        'username' => $data->username,
                        'email' => $data->email 
                ];
            
            $u = new User ();
            if ($ui = UsersInvited::findOne ( [ 
                    'email' => $email 
            ] )) {
                $u->id_company_profile = $ui->id_company_profile;
            }
            $returnUrl = $data->return_url;
            
            $u->username = $data->username;
            $u->password_hash = Helpers::getPasswordHash ( $data->password );
            $u->email = $data->email;
            $u->auth_key = \Yii::$app->security->generateRandomString ();
            $u->created_at = time ();
            $u->confirmed_at = time ();
            
            $u->updated_at = time ();
            if ($u->save ()) {
                \Yii::$app->mailer->compose ( '@app/mail/trustee-register-confirmation', [ 
                        'username' => $data->username,
                        'password' => $data->password,
                        'returnUrl' => $returnUrl 
                ] )->setTo ( $u->email )->setFrom ( [ 
                        \Yii::$app->params ['adminEmail'] => Yii::t ( 'app', '{0} admin', [ 
                                \Yii::$app->name 
                        ] ) 
                ] )->setSubject ( Yii::t ( 'app', 'You have been registered in in {0}', [ 
                        \Yii::$app->name 
                ] ) )->send ();
            }
            return self::RESPONSE_OK + [ 
                    'user_id' => $u->id 
            ] + [ 
                    'passh' => $u->password_hash,
                    'pass' => $data->password 
            ];
        } else
            return self::RESPONSE_BAD_REQUEST + [ 
                    'msg' => 'no post value' 
            ];
    }
    
    /*
     * User Register
     *
     * @return object Action Status
     */
    public function actionRegister() {
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            
            $email = User::find ()->where ( [ 
                    'email' => $data->email 
            ] )->one ();
            $username = User::find ()->where ( [ 
                    'username' => $data->username 
            ] )->one ();
            if ($username && $email)
                return [ 
                        'status' => false,
                        'response' => 'email and username exists',
                        'username' => $data->username,
                        'email' => $data->email 
                ];
            if ($username)
                return [ 
                        'status' => false,
                        'response' => 'username exists',
                        'username' => $data->username,
                        'email' => $data->email 
                ];
            if ($email)
                return [ 
                        'status' => false,
                        'response' => 'email exists',
                        'username' => $data->username,
                        'email' => $data->email 
                ];
            
            // create user object
            $u = new User ();
            if ($ui = UsersInvited::findOne ( [ 
                    'email' => $email 
            ] )) {
                $u->id_company_profile = $ui->id_company_profile;
            }
            $returnUrl = $data->return_url;
            
            // set user data
            $u->username = $data->username;
            $u->password_hash = Helpers::getPasswordHash ( $data->password );
            $u->email = $data->email;
            $u->auth_key = \Yii::$app->security->generateRandomString ();
            $u->created_at = time ();
            $u->updated_at = time ();
            if ($u->save ()) {
                \Yii::$app->mailer->compose ( '@app/mail/confirmation', [ 
                        'key' => $u->auth_key,
                        'username' => $u->username,
                        'returnUrl' => $returnUrl 
                ] )->setTo ( $u->email )->setFrom ( [ 
                        \Yii::$app->params ['adminEmail'] => Yii::t ( 'app', '{0} admin', [ 
                                \Yii::$app->name 
                        ] ) 
                ] )->setSubject ( Yii::t ( 'app', 'Thank you for registration in {0}', [ 
                        \Yii::$app->name 
                ] ) )->send ();
                return self::RESPONSE_OK + [ 
                        'user_id' => $u->id,
                        'auth_key' => $u->auth_key 
                ];
            }
        } else
            return self::RESPONSE_BAD_REQUEST;
    }
    
    /*
     * Register invited user by company administrator
     *
     * @return object Action Status
     */
    public function actionRegisterInvited() {
        if ($post = \Yii::$app->request->post ()) {
            
            $data = json_decode ( json_encode ( $post ) );
            
            if (! isset ( $data->token ))
                return self::RESPONSE_BAD_REQUEST;
            
            $invitedUser = UsersInvited::findValidByToken ( $data->token );
            if (! $invitedUser)
                return self::RESPONSE_BAD_REQUEST;
            
            if (! isset ( $data->username ))
                return self::RESPONSE_BAD_REQUEST;
            
            $email = User::find ()->where ( [ 
                    'email' => $data->email 
            ] )->one ();
            $username = User::find ()->where ( [ 
                    'username' => $data->username 
            ] )->one ();
            if ($username && $email)
                return [ 
                        'status' => false,
                        'response' => 'email and username exists',
                        'username' => $data->username,
                        'email' => $data->email 
                ];
            if ($username)
                return [ 
                        'status' => false,
                        'response' => 'username exists',
                        'username' => $data->username,
                        'email' => $data->email 
                ];
            if ($email)
                return [ 
                        'status' => false,
                        'response' => 'email exists',
                        'username' => $data->username,
                        'email' => $data->email 
                ];
            
            $u = new User ();
            
            $differentEmails = false;
            if ($data->email !== $invitedUser->email)
                $differentEmails = true;
            
            $id_company_profile = $data->id_company_profile;
            $returnUrl = $data->return_url;
            
            // set username data
            $u->username = $data->username;
            $u->password_hash = Helpers::getPasswordHash ( $data->password );
            $u->email = $data->email;
            $u->auth_key = \Yii::$app->security->generateRandomString ();
            $u->created_at = time ();
            $u->updated_at = time ();
            if (! $differentEmails)
                $u->confirmed_at = time ();
            $u->id_company_profile = $id_company_profile;
            
            if (! $u->save ())
                return self::RESPONSE_ERR;
            
            $profile = new CustomerProfile ();
            $profile->user_id = $u->id;
            if (isset ( $data->name ))
                $profile->name = $data->name;
            if (isset ( $data->surname ))
                $profile->surname = $data->surname;
            
            if (isset ( $data->phone ))
                $profile->phone_num = $data->phone;
            
            $invitedUser->email = $data->email;
            $invitedUser->valid = 0;
            
            if ($invitedUser->save ()) {
                
                if ($differentEmails)
                    \Yii::$app->mailer->compose ( '@app/mail/confirmation', [ 
                            'key' => $u->auth_key,
                            'username' => $u->username,
                            'returnUrl' => $returnUrl 
                    ] )->setFrom ( [ 
                            \Yii::$app->params ['adminEmail'] => \Yii::$app->name 
                    ] )->setTo ( $u->email )->setSubject ( Yii::t ( 'app', 'Thank you for registration in {0}', [ 
                            \Yii::$app->name 
                    ] ) )->send ();
                else
                    \Yii::$app->mailer->compose ( '@app/mail/register-invited', [ 
                            'email' => $data->email,
                            'username' => $u->username,
                            'returnUrl' => $returnUrl 
                    ] )->setTo ( $email )->setFrom ( [ 
                            \Yii::$app->params ['adminEmail'] => \Yii::$app->name 
                    ] )->setSubject ( Yii::t ( 'app', 'You have been invited to {0} application', [ 
                            \Yii::$app->name 
                    ] ) )->send ();
                return self::RESPONSE_OK;
            } else
                return self::STATUS_FALSE + [ 
                        'errors' => $invitedUser->errors 
                ];
        }
        return self::RESPONSE_BAD_REQUEST;
    }
    
    /*
     * Action Logout
     *
     * @param string $t Access Token
     * @return object Action Status
     */
    public function actionLogout($t = null) {
        if (! $t)
            return self::RESPONSE_OK;
        
        // if is set token, than renew token
        $u = User::findIdentityByAccessToken ( $t );
        if (! $u)
            return self::RESPONSE_OK;
        
        $u->auth_key = \Yii::$app->security->generateRandomString ();
        $u->save ();
        
        return self::RESPONSE_OK;
    }
    
    /*
     * Get User Info
     *
     * @return object User Info Object
     */
    public function actionGetUserInfo() {
        $retVal = Security::getUserInfo ();
        if ($retVal)
            return self::RESPONSE_OK + $retVal;
        return self::RESPONSE_ERR;
    }
    
    /*
     * Check if user is logged in
     *
     * @return object Action Status
     */
    public function actionIsLoggedIn() {
        return self::RESPONSE_OK + [ 
                'uid' => \Yii::$app->user->identity->getCompanyProfileId () 
        ];
    }
    
    /*
     * Confirm address email
     *
     * @return object Action Status
     */
    public function actionConfirmEmail() {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            $user = User::find ()->where ( [ 
                    'auth_key' => $data->{'key'} 
            ] )->one ();
            
            
            if (! $user)
                return self::RESPONSE_USER_DOES_NOT_EXISTS;
            
            //user found, set confirmed_at variable to current timestamp
            if (! $user->confirmed_at) {
                $user->confirmed_at = time ();
                $user->save ();
                return self::RESPONSE_OK;
            } else
                return self::RESPONSE_BAD_REQUEST;
        } else
            return self::RESPONSE_BAD_REQUEST;
    }
    
    /*
     * Save New Password after reset
     *
     * @return object Action Status
     */
    public function actionSavePassword() {
        if (! $post = \Yii::$app->request->post ())
            return self::RESPONSE_BAD_REQUEST;
        
        $data = json_decode ( json_encode ( $post ) );
        if (! $data || ! isset ( $data->password ))
            return self::RESPONSE_BAD_REQUEST;
        
        $u = User::findOne ( \Yii::$app->user->id );
        $u->password_hash = Helpers::getPasswordHash ( $data->password );
        if ($u->save ())
            return self::RESPONSE_OK;
        return self::RESPONSE_BAD_REQUEST + [ 
                'msg' => 'cant save user model' 
        ];
    }
    
    /*
     * Change current Passwrod
     *
     * @return object Action Status
     */
    public function actionChangePassword() {
        if (! $post = \Yii::$app->request->post ())
            return self::RESPONSE_BAD_REQUEST;
        
        $data = json_decode ( json_encode ( $post ) );
        
        if (! isset ( $data->new_password ) || ! isset ( $data->password ))
            return self::RESPONSE_BAD_REQUEST;
        
        $password = $data->password;
        $new_password = $data->new_password;
        
        $u = User::findOne ( Yii::$app->user->id );
        
        if ($u->password_hash != Helpers::getPasswordHash ( $password ))
            return self::RESPONSE_WRONG_AUTH_DATA;
        
        $u->password_hash = Helpers::getPasswordHash ( $new_password );
        $u->auth_key = \Yii::$app->security->generateRandomString ();
        if ($u->save ())
            return self::RESPONSE_OK;
        return self::RESPONSE_ERR;
    }
    
    /*
     * Change password reset
     *
     * @return object Action Status
     */
    public function actionChangePasswordReset() {
        if (! $post = \Yii::$app->request->post ())
            return self::RESPONSE_BAD_REQUEST;
        
        $data = json_decode ( json_encode ( $post ) );
        
        if (! isset ( $data->new_password ))
            return self::RESPONSE_BAD_REQUEST;
        
        $new_password = $data->new_password;
        $key = $data->key;
        
        $u = User::findOne ( [ 
                'auth_key' => $key 
        ] );
        
        if (! $u) {
            return self::RESPONSE_MODEL_NOT_FOUND;
        }
        
        $u->password_hash = Helpers::getPasswordHash ( $new_password );
        $u->auth_key = \Yii::$app->security->generateRandomString ();
        if ($u->save ())
            return self::RESPONSE_OK;
        return self::RESPONSE_ERR;
    }
    
    /*
     * Reset password request
     *
     * @return object Action Status
     */
    public function actionResetPasswordRequest() {
        if (! $post = \Yii::$app->request->post ())
            return self::RESPONSE_BAD_REQUEST;
        
        $data = json_decode ( json_encode ( $post ) );
        if (! isset ( $data->email ) || ! isset ( $data->return_url ))
            return self::RESPONSE_BAD_REQUEST;
        $email = $data->email;
        if (! $user = User::findOne ( [ 
                'email' => $email 
        ] ))
            return self::RESPONSE_USER_DOES_NOT_EXISTS;
        $returnUrl = $data->return_url;
        
        \Yii::$app->mailer->compose ( '@app/mail/reset-request', [ 
                'key' => $user->auth_key,
                'username' => $user->username,
                'returnUrl' => $returnUrl 
        ] )->setFrom ( [ 
                \Yii::$app->params ['adminEmail'] => Yii::$app->name 
        ] )->setTo ( $user->email )->setSubject ( Yii::t ( 'app', 'Reset password request' ) )->send ();
        return self::STATUS_TRUE + self::RESPONSE_OK;
    }
    
    /*
     * Reset Password
     *
     * @return object Action Status
     */
    public function actionResetPassword() {
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            
            if (! isset ( $data->new_password ) || ! isset ( $data->email ) || ! isset ( $data->key ))
                return self::RESPONSE_BAD_REQUEST;
            
            $new_password = $data->new_password;
            $authKey = $data->key;
            
            $u = User::findOne ( Yii::$app->user->id );
            
            if ($u->auth_key != $authKey)
                return self::RESPONSE_WRONG_AUTH_DATA;
            
            $u->password_hash = Helpers::getPasswordHash ( $new_password );
            $u->auth_key = \Yii::$app->security->generateRandomString ();
            $u->save ();
            return self::RESPONSE_OK;
        }
    }
    
    /*
     * Check if username exists
     *
     * @return object Action Status
     */
    public function actionCheckUsernameExists() {
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            if (! isset ( $data->username ))
                return self::RESPONSE_BAD_REQUEST;
            
            $u = User::findOne ( [ 
                    'username' => $data->username 
            ] );
            if ($u)
                return self::RESPONSE_USERNAME_ALREADY_EXISTS;
            return self::RESPONSE_OK;
        }
    }
    
    /*
     * Check if email exists
     *
     * @return object Action Status
     */
    public function actionCheckEmailExists() {
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            if (! isset ( $data->email ))
                return self::RESPONSE_BAD_REQUEST;
            
            $u = User::findOne ( [ 
                    'email' => $data->email 
            ] );
            if ($u)
                return self::RESPONSE_EMAIL_ALREADY_EXISTS;
            return self::RESPONSE_OK;
        }
    }
    
    /*
     * Resend activation link
     *
     * @return object Action Status
     */
    public function actionResend() {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            
            $user = User::find ()->where ( [ 
                    'email' => $data->{'email'} 
            ] )->one ();
            if (! $user)
                return self::STATUS_FALSE + self::RESPONSE_USER_DOES_NOT_EXISTS;
            
            $returnUrl = $data->return_url;
            
            \Yii::$app->mailer->compose ( '@app/mail/confirmation', [ 
                    'key' => $user->auth_key,
                    'username' => $user->username,
                    'returnUrl' => $returnUrl 
            ] )->setFrom ( [ 
                    \Yii::$app->params ['adminEmail'] => Yii::$app->name 
            ] )->setTo ( $user->email )->setSubject ( Yii::t ( 'app', 'Resend activation link' ) )->send ();
            return self::RESPONSE_OK;
        } else
            return [ 
                    'status' => false,
                    self::RESPONSE_NO_POST_VALUE 
            ];
    }
}
