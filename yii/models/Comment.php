<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "comment".
 *
 * @property integer $customer_id
 * @property string $comment
 * @property integer $order_id
 * @property string $added
 * @property string $price_rating
 * @property string $contact_rating
 * @property string $punctuality_rating
 */
class Comment extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'comment';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['customer_id', 'order_id', 'price_rating', 'contact_rating', 'punctuality_rating'], 'required'],
            [['customer_id', 'order_id'], 'integer'],
            [['comment'], 'string'],
            [['added'], 'safe'],
            [['price_rating', 'contact_rating', 'punctuality_rating'], 'number'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'customer_id' => 'Customer ID',
            'comment' => 'Comment',
            'order_id' => 'Order ID',
            'added' => 'Added',
            'general_rating' => 'General Rating',
            'price_rating' => 'Price Rating',
            'contact_rating' => 'Contact Rating',
            'punctuality_rating' => 'Punctuality Rating',
        ];
    }
}
