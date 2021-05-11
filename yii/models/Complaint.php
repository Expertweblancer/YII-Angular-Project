<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "complaint".
 *
 * @property integer $order_id
 * @property string $message
 * @property integer $not_realized
 * @property string $filename
 */
class Complaint extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'complaint';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['order_id', 'message'], 'required'],
            [['order_id', 'not_realized'], 'integer'],
            [['message'], 'string'],
            [['filename'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'order_id' => 'Order ID',
            'message' => 'Message',
            'not_realized' => 'Not Realized',
            'filename' => 'Filename',
        ];
    }
}
