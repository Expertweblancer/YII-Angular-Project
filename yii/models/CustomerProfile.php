<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "customer_profile".
 *
 * @property string $user_id
 * @property string $name
 * @property string $surname
 * @property string $phone_num
 * @property string $phone_area
 * @property string $dob
 * @property string $id_address
 * @property string $foto
 * @property integer $id_currency
 * @property integer $trustee_id
 */
class CustomerProfile extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'customer_profile';
    }
	
    public function beforeValidate(){
    	if (!$this->user_id)
    		$this->user_id = \Yii::$app->user->id;
    	return true;
    }
    public function beforeSave($insert){
    	if ($insert && \Yii::$app->user->identity->isTrustee){
    		$this->trustee_id = \Yii::$app->user->id;
    	}
    	return true;
    }
    public function afterSave($insert, $changedAttributes){
    	if ($insert)
    		Order::updateAll(['is_active'=>1], 'user_id='.$this->user_id);
    }
    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'name', 'surname', 'phone_num'], 'required'],
            [['user_id', 'id_address', 'id_currency', 'trustee_id'], 'integer'],
            [['dob'], 'safe'],
            [['name', 'surname'], 'string', 'max' => 255],
            [['phone_num'], 'string', 'max' => 15],
            [['phone_area'], 'string', 'max' => 5],
            [['foto'], 'string', 'max' => 255],
        ];
    }
}
