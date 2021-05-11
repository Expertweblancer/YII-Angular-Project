<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "notifications".
 *
 * @property integer $id
 * @property string $text
 * @property string $category
 * @property integer $user_id
 * @property integer $order_id
 * @property integer $read
 * @property string $data
 * @property string $created
 */
class Notifications extends \yii\db\ActiveRecord
{
	const CAT_NEW_OFFER = "new-offer";
	const CAT_UPDATE_OFFER = "update-offer";
	const CAT_WON_OFFER = "won-offer";
	const CAT_ORDER_COMPLEATED = "order-compleated";
	const CAT_OFFER_RATED = "offer-rated";
	const CAT_INVOICE_SET = "invoice-set";
	const CAT_OFFER_PRICED = "offer-priced";
	const CAT_OFFER_LOST = "offer-lost";
	/**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'notifications';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['text', 'category', 'user_id'], 'required'],
            [['user_id', 'read', 'order_id'], 'integer'],
            [['created'], 'safe'],
            [['text'], 'string', 'max' => 255],
            [['category'], 'string', 'max' => 36],
            [['data'], 'string', 'max' => 100],
        ];
    }
}
