<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "order_time".
 *
 * @property string $id_order
 * @property string $sending_since_1
 * @property string $sending_since_2
 * @property string $sending_since_3
 * @property string $sending_until_1
 * @property string $sending_until_2
 * @property string $sending_until_3
 * @property string $delivery_since_1
 * @property string $delivery_since_2
 * @property string $delivery_since_3
 * @property string $delivery_until_1
 * @property string $delivery_until_2
 * @property string $delivery_until_3
 */
class OrderTime extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'order_time';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id_order', 'sending_since_1', 'sending_until_1', 'delivery_since_1', 'delivery_until_1'], 'required'],
            [['id_order'], 'integer'],
            [['sending_since_1', 'sending_since_2', 'sending_since_3', 'sending_until_1', 'sending_until_2', 'sending_until_3', 'delivery_since_1', 'delivery_since_2', 'delivery_since_3', 'delivery_until_1', 'delivery_until_2', 'delivery_until_3'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id_order' => 'Id Order',
            'sending_since_1' => 'Sending Since 1',
            'sending_since_2' => 'Sending Since 2',
            'sending_since_3' => 'Sending Since 3',
            'sending_until_1' => 'Sending Until 1',
            'sending_until_2' => 'Sending Until 2',
            'sending_until_3' => 'Sending Until 3',
            'delivery_since_1' => 'Delivery Since 1',
            'delivery_since_2' => 'Delivery Since 2',
            'delivery_since_3' => 'Delivery Since 3',
            'delivery_until_1' => 'Delivery Until 1',
            'delivery_until_2' => 'Delivery Until 2',
            'delivery_until_3' => 'Delivery Until 3',
        ];
    }
}
