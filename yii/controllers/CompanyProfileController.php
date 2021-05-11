<?php

namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\VerbFilter;
use app\components\CustomCors;
use app\components\BaseRestController;
use app\models\CompanyProfile;
use app\models\Address;
use app\models\User;

class CompanyProfileController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\CompanyProfile';
    
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
     * Get single Company Profile
     * @param integer $id Company ID
     * @return object Single Comment
     */
    public function actionView($id) {
        if ($id == 0)
            $id = \Yii::$app->user->identity->getCompanyProfileId ();
        if (! $id)
            return self::RESPONSE_MODEL_NOT_FOUND;
        
        return CompanyProfile::findOne ( $id );
    }
    
    /**
     * Get Employees
     * @param integer $cid Company ID
     * @return object[] Employees list
     */
    public function actionEmployees($cid = null) {
        $id = $cid ? $cid : \Yii::$app->user->identity->companyProfileId;
        if ($id) {
            return User::find ()->select ( 'username, email, id' )->where ( [ 
                    'id_company_profile' => $id 
            ] )->all ();
        }
        return [ ];
    }
    
    /**
     * Has Trustee Priviliges
     * @return object Specifying if currernt user is trustee
     */
    public function actionTrustee() {
        return [ 
                'trustee' => \Yii::$app->user->identity->isTrustee 
        ];
    }
    
    /**
     * Check if current user has company profile
     * @return boolean Specifying if currernt has company profile
     */
    public function actionHasCompanyProfile() {
        return (\Yii::$app->user->identity->getCompanyProfileId () !== null);
    }
    
    /**
     * Get employees of current user
     *
     * @return object[] Specifying current user employees list
     */
    public function actionGetEmployees() {
        $cpid = \Yii::$app->user->identity->companyProfileId ();
        return User::find ()->select ( 'user.id, user.username, customer_profile.name, customer_profile.surname' )->where ( [ 
                'company_profile_id' => $cpid 
        ] )->where ()->all ();
    }
    
    /**
     * Set Company Profile
     *
     * @return object Specifying saved company profile
     */
    public function actionSetProfile() {
        $response = "";
        if ($post = \Yii::$app->request->post ()) {
            $id = \Yii::$app->user->identity->getCompanyProfileId ();
            if (! $id || ! $model = CompanyProfile::findOne ( $id )) {
                $model = new CompanyProfile ();
                $addressModel = new Address ();
            } else
                $addressModel = Address::findOne ( $model->id_address );
            if (! $addressModel)
                $addressModel = new Address ();
            
            // conver post JSON data to object
            $data = json_decode ( json_encode ( $post ) );
            
            // set address
            if (isset ( $data->address1 ))
                $addressModel->address1 = $data->address1;
            if (isset ( $data->address2 ))
                $addressModel->address2 = $data->address2;
            if (isset ( $data->postal ))
                $addressModel->postal = $data->postal;
            if (isset ( $data->city ))
                $addressModel->city = $data->city;
            if (isset ( $data->id_country ))
                $addressModel->id_country = $data->id_country;
            if (! $addressModel->save ())
                return self::RESPONSE_ERR + [ 
                        'error' => $addressModel->errors 
                ];
            
            $model->id_address = $addressModel->id;
            
            // set personal information
            if (isset ( $data->name ))
                $model->name = $data->name;
            if (isset ( $data->no_vat ))
                $model->no_vat = $data->no_vat;
            if (isset ( $data->description ))
                $model->description = $data->description;
            if (isset ( $data->foto ))
                $model->foto = $data->foto;
            
            if (! $model->save ()) {
                return self::RESPONSE_ERR + [ 
                        'error' => $model->errors 
                ];
            }
            return [ 
                    'model' => $model 
            ] + self::RESPONSE_OK;
        } else
            return self::RESPONSE_BAD_REQUEST;
    }
    
    /**
     * Filter company profile
     *
     * @return object Specifying saved company profile
     */
    public function actionFilter() {
        if ($post = \Yii::$app->request->post ()) {
            $data = json_decode ( json_encode ( $post ) );
            
            // specify WHERE part of MySQL query based on post data
            
            $where = '';
            
            // filter by name
            if (isset ( $data->name )) {
                $where = "name LIKE '%$data->name%'";
            }
            
            // filter by VAT number
            if (isset ( $data->no_vat )) {
                if ($where != '') {
                    $where .= " AND no_vat LIKE '%$data->no_vat%'";
                } else {
                    $where = "no_vat LIKE '%$data->no_vat%'";
                }
            }
            // filter by contact person
            if (isset ( $data->contact_person )) {
                if ($where != '') {
                    $where .= " AND contact_person LIKE '%$data->contact_person%'";
                } else {
                    $where = "contact_person LIKE '%$data->contact_person%'";
                }
            }
            // filter by telephone number
            if (isset ( $data->tel )) {
                if ($where != '') {
                    $where .= " AND tel LIKE '%$data->tel%'";
                } else {
                    $where = "tel LIKE '%$data->tel%'";
                }
            }
            return CompanyProfile::find ()->where ( $where )->all ();
        }
        // if not post value with filter elements, than return all companies
        return CompanyProfile::find ()->all ();
    }
}