<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "parcel".
 *
 * @property string $id
 * @property integer $order_id
 * @property string $name
 * @property integer $width
 * @property integer $height
 * @property integer $depth
 * @property integer $weight
 * @property string $created
 * @property string $description
 */
class Parcel extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'parcel';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['order_id', 'width', 'height', 'depth', 'weight'], 'integer'],
            [['created'], 'safe'],
            [['name', 'description'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'order_id' => 'Order ID',
            'name' => 'Name',
            'width' => 'Width',
            'height' => 'Height',
            'depth' => 'Depth',
            'weight' => 'Weight',
            'created' => 'Created',
            'description' => 'Description',
        ];
    }
}
