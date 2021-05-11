<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "fleet_order_categories".
 *
 * @property integer $id_fleet
 * @property integer $id_category
 */
class FleetOrderCategories extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'fleet_order_categories';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id_fleet', 'id_category'], 'required'],
            [['id_fleet', 'id_category'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id_fleet' => 'Id Fleet',
            'id_category' => 'Id Category',
        ];
    }
}
