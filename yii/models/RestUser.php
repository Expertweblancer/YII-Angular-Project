<?php

namespace app\models;

use Yii;


class RestUser extends \yii\db\ActiveRecord
{
	public $password;
	const SCENARIO_LOGIN = 'login';
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
            [['username', 'password',], 'required'],
            [['username', 'password'], 'string', 'max' => 255],
            [['password_hash'], 'string', 'max' => 60],
            [['auth_key'], 'string', 'max' => 32],
        	[['username', 'password']=>'safe']
       ];
    }
     /**
     * @inheritdoc
     */
 }
