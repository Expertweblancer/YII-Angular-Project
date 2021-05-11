<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "company_profile".
 *
 * @property integer $id
 * @property string $name
 * @property string $description
 * @property string $foto
 * @property string $id_address
 * @property string $no_vat
 * @property integer $currency_id
 * @property string $contact_person
 * @property string $tel
 * @property integer $trustee_id
 *
 * @property Offer[] $offers
 */
class CompanyProfile extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'company_profile';
    }
	
    public function beforeSave($insert){
    	if ($insert && \Yii::$app->user->identity->isTrustee){
    		$this->trustee_id = \Yii::$app->user->id;
    	}
    	return true;
    }
    
    public function afterSave($insert, $changedAttributes){
    	if ($insert){
    		$u = User::findOne(\Yii::$app->user->id);
    		if (!$u->id_company_profile){
    			$u->id_company_profile = $this->id;
    			$u->save();
    		}
    	}
    }
    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'no_vat', 'currency_id'], 'required'],
            [['description'], 'string'],
            [['id_address', 'currency_id', 'trustee_id'], 'integer'],
            [['name'], 'string', 'max' => 40],
            [['foto'], 'string', 'max' => 255],
        	[['no_vat'], 'string', 'max' => 20],
        	[['contact_person'], 'string', 'max' => 255],
            [['tel'], 'string', 'max' => 30],
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getOffers()
    {
        return $this->hasMany(Offer::className(), ['company_id' => 'id']);
    }
}
