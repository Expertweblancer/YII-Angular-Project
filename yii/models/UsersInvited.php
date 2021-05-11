<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "users_invited".
 *
 * @property string $email
 * @property integer $id_company_profile
 * @property string $created
 * @property string $name
 * @property string $surname
 * @property string $phone
 * @property string $token
 * @property integer $valid 
 */
class UsersInvited extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'users_invited';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['email', 'id_company_profile', 'token'], 'required'],
        	[['id_company_profile', 'valid'], 'integer'],
            [['created'], 'safe'],
            [['email'], 'string', 'max' => 255],
            [['name', 'surname', 'phone'], 'string', 'max' => 50],
            [['token'], 'string', 'max' => 20],
        ];
    }

    /**
     * @inheritdoc
     */
    public static function findValidByToken($token)
    {
    	return static::find()->where(['token' => $token, 'valid'=>1])->one();
    }
    public static function findValidByTokenArray($token)
    {
    	return static::find()->where(['token' => $token, 'valid'=>1])->asArray()->one();
    }
}
