<?php

namespace app\models;

use Yii;
use yii\web\IdentityInterface;

/**
 * This is the model class for table "user".
 *
 * @property integer $id
 * @property string $username
 * @property string $email
 * @property string $password_hash
 * @property string $auth_key
 * @property integer $confirmed_at
 * @property string $unconfirmed_email
 * @property integer $blocked_at
 * @property string $registration_ip
 * @property integer $created_at
 * @property integer $updated_at
 * @property integer $flags
 * @property integer $last_login_at
 * @property integer $id_company_profile
 *
 * @property Hero[] $heroes
 */
class User extends \yii\db\ActiveRecord implements IdentityInterface
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['username', 'email', 'password_hash', 'auth_key', 'created_at', 'updated_at'], 'required'],
            [['confirmed_at', 'blocked_at', 'created_at', 'updated_at', 'flags', 'last_login_at', 'id_company_profile'], 'integer'],
            [['username', 'email', 'unconfirmed_email'], 'string', 'max' => 255],
            [['password_hash'], 'string', 'max' => 60],
            [['auth_key'], 'string', 'max' => 32],
            [['registration_ip'], 'string', 'max' => 45],
            [['username'], 'unique'],
            [['email'], 'unique'],
        ];
    }

    public static function findIdentity($id)
    {
    	return static::findOne($id);
    }
    
    /**
     * Finds an identity by the given token.
     *
     * @param string $token the token to be looked for
     * @return IdentityInterface|null the identity object that matches the given token.
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
    	return static::findOne(['auth_key' => $token]);
    }
    
    /**
     * @return int|string current user ID
     */
    public function getId()
    {
    	return $this->id;
    }
    
    /**
     * @return string current user auth key
     */
    public function getAuthKey()
    {
    	return $this->auth_key;
    }
    
    /**
     * @param string $authKey
     * @return bool if auth key is valid for current user
     */
    public function validateAuthKey($authKey)
    {
    	return $this->getAuthKey() === $authKey;
    }
    
    /**
     * @param integer $id
     * @return bool if user is admin
     */
    public function getIsAdmin($id=null)
    {	
    	$roles = Yii::$app->authManager->getRolesByUser($this->id);
    	if (!$roles) {
    		return false;
    	}
    	 
    	reset($roles);
    	/* @var $role \yii\rbac\Role */
    	$role = current($roles);
    	return $role->name=="admin";
    }
	
    public function getCompanyProfileId(){
    	return $this->id_company_profile;
    }

    public function getIsConfirmed(){
    	return $this->confirmed_at;
    }
    
    
    public function getHasCompanyProfile(){
    	return ($this->id_company_profile &&  $this->id_company_profile>0)?true:false;
    }
    
    public function getIsTrustee()
    {
    	$roles = Yii::$app->authManager->getRolesByUser($this->id);
    	if (!$roles) {
    		return false;
    	}
    	 
    	reset($roles);
    	/* @var $role \yii\rbac\Role */
    	$role = current($roles);
    	return $role->name=="trustee" || $role->name=="admin" ;
    }
    
}
