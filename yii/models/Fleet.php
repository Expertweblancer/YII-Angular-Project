<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "fleet".
 *
 * @property string $id
 * @property integer $id_company_profile
 * @property string $name
 * @property string $registration
 * @property string $foto
 * @property string $desc
 * @property integer $id_type
 * @property integer $year
 * @property integer $width
 * @property integer $height
 * @property integer $loading_width
 * @property integer $loading_length
 * @property integer $loading_height
 * @property integer $max_kg
 * @property integer $max_km
 * @property string $km_rate
 */
class Fleet extends \yii\db\ActiveRecord
{
	public $fleet_order_categories;
	
	public function beforeSave($insert){
		$this->id_company_profile = \Yii::$app->user->identity->getCompanyProfileId();
		return true;
	}
	
	public function afterSave($insert, $changedAttributes){
		FleetOrderCategories::deleteAll(['id_fleet'=>$this->id]);
		
		if($this->fleet_order_categories)
			foreach ($this->fleet_order_categories as $cid){
				$foc = new FleetOrderCategories();
				$foc->id_category = $cid;
				$foc->id_fleet = $this->id;
				$foc->save();
		}
	}
	
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'fleet';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id_company_profile', 'id_type', 'year', 'width', 'height', 'loading_width', 'loading_length', 'loading_height', 'max_kg', 'max_km'], 'integer'],
            [['name', 'id_type'], 'required'],
            [['km_rate'], 'number'],
            [['name'], 'string', 'max' => 50],
            [['registration'], 'string', 'max' => 15],
            [['foto'], 'string', 'max' => 255],
            [['desc'], 'string', 'max' => 255],
        	[['fleet_order_categories'], 'safe']
        ];
    }
}
