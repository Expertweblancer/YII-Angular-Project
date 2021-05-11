<?php

namespace app\controllers;

use app\components\CustomCors;
use app\components\BaseRestController;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\CompositeAuth;
use app\models\User;
use app\models\Address;
use Yii;
use yii\filters\VerbFilter;
use app\models\CustomerProfile;

class CustomerProfileController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\CustomerProfile';
    
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
        $behaviors ['verbs'] = [ 
                'class' => VerbFilter::className () 
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
        $a = parent::actions ();
        unset ( $a ['view'] );
        return $a;
    }
    
    /**
     * Get single customer profile
     *
     * @param integer $id Customer profile ID
     * @return object single customer profile object
     */
    public function actionView($id) {
        $uid = $id ? $id : \Yii::$app->user->id;
        return User::find ()->select ( 'user.id as user_id,id, email, trustee_id, customer_profile.name, surname, phone_num, id_address, id_currency, foto' )->where ( [ 
                'id' => $uid 
        ] )->leftJoin ( 'customer_profile', 'user_id = user.id' )->asArray ()->one ();
    }
    
    /*
     * Get filtered customer's list
     *
     * @return actions array
     */
    public function actionFilter() {
        $where = 'user.id_company_profile IS NULL';
        
        if ($post = \Yii::$app->request->post ()) {
            // decode post data
            $data = json_decode ( json_encode ( $post ) );
            
            //build string query
            
            // filter by name
            if (isset ( $data->name ) && $data->name != '')
                $where .= " AND name LIKE '%$data->name%'";
            
            // filter by surname
            if (isset ( $data->surname ) && $data->surname != '')
                $where .= " AND surname LIKE '%$data->surname%'";
            
            // filter by email
            if (isset ( $data->email ) && $data->email != '')
                $where .= " AND email LIKE '%$data->email%'";
            
            // filter by phone number
            if (isset ( $data->tel ) && $data->tel != '')
                $where .= " AND phone_num LIKE '%$data->tel%'";
        }
        
        return User::find ()->select ( 'email, id, customer_profile.*' )->where ( $where )->leftJoin ( 'customer_profile', 'customer_profile.user_id = user.id' )->asArray ()->all ();
    }
    
    /**
     * Unset get profile
     * @param integer $uid User ID
     * @return object Profile
     */
    public function actionGetProfile($uid = 0) {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        
        if ($uid > 0 && (\Yii::$app->user->identity->isAdmin || \Yii::$app->user->identity->isTrustee))
            $id = $uid;
        else
            $id = \Yii::$app->user->id;
        
        $profile = User::find ()->select ( 'user.email, user.username, user.id, customer_profile.*, address.*' )->leftJoin ( "customer_profile", 'customer_profile.user_id=user.id' )->leftJoin ( 'address', 'address.id=customer_profile.id_address' )->where ( [ 
                'user.id' => $id 
        ] )->asArray ()->one ();
        return self::RESPONSE_OK + $profile;
    }
    
    /**
     * Unset set profile
     * @return object Profile
     */
    public function actionSetProfile() {
        // get post data
        if (! ($post = \Yii::$app->request->post ()))
            return self::RESPONSE_BAD_REQUEST;
        
        // set user id of current logged in user
        $uid = Yii::$app->user->id;
        
        // convert json to object
        $data = json_decode ( json_encode ( $post ) );
        
        // validate data
        if (! isset ( $data->address1 ) || ! isset ( $data->city ) || ! isset ( $data->postal ) || ! isset ( $data->id_country ) 
                || ! isset ( $data->phone_num ) || ! isset ( $data->name ) || ! isset ( $data->surname ))
            return self::RESPONSE_BAD_REQUEST;
        
        // check if profile already exists, if not create new Profile object
        if ($profileModel = CustomerProfile::findOne ( $uid )) {
            $addressModel = Address::findOne ( $profileModel->id_address );
            if (! $addressModel)
                $addressModel = new Address ();
        } else {
            $profileModel = new Profile ();
            $addressModel = new Address ();
        }
        
        // set profile data
        $addressModel->address1 = $data->address1;
        if (isset ( $data->address2 ))
            $addressModel->address2 = $data->address2;
        $addressModel->city = $data->city;
        $addressModel->postal = $data->postal;
        $addressModel->id_country = $data->id_country;
        if (! $addressModel->save ())
            return self::RESPONSE_ERR + [ 
                    'model' => $addressModel 
            ];
        
        if (isset ( $data->foto )) {
            $profileModel->foto = $data->foto;
        }
        
        $profileModel->phone_num = $data->phone_num;
        $profileModel->dob = $data->dob;
        $profileModel->id_address = $addressModel->id;
        $profileModel->name = $data->name;
        $profileModel->surname = $data->surname;
        $profileModel->user_id = $uid;
        
        // if not properly saved return error
        if (! $profileModel->save ())
            return self::RESPONSE_ERR + [ 
                    'model' => $profileModel,
                    'errors' => $profileModel->errors 
            ];
        
        return self::RESPONSE_OK;
    }
}