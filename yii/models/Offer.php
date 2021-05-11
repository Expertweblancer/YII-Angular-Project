<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "offer".
 *
 * @property string $order_id
 * @property integer $company_user_id
 * @property string $date_added
 * @property string $date_selected
 * @property string $date_updated
 * @property string $date_execution
 * @property integer $is_selected
 * @property string $your_price
 * @property string $min_price
 * @property string $note
 * @property integer $car_id
 * @property integer $chosen
 *
 * @property User $companyUser
 * @property Order $order
 */
class Offer extends \yii\db\ActiveRecord
{
	const offer_updated = "offer updated";
	const new_offer = "new offer";
	const offer_selected = "offer selected";
	const offer_realized = "offer realized";
	/**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'offer';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['order_id', 'company_user_id', 'date_execution'], 'required'],
            [['order_id', 'company_user_id', 'is_selected', 'car_id', 'chosen'], 'integer'],
            [['date_added', 'date_selected', 'date_updated', 'date_execution'], 'safe'],
            [['your_price', 'min_price'], 'number'],
            [['note'], 'string'],
            [['company_user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['company_user_id' => 'id']],
            [['order_id'], 'exist', 'skipOnError' => true, 'targetClass' => Order::className(), 'targetAttribute' => ['order_id' => 'id']],
        ];
    }

    
    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCompanyUser()
    {
        return $this->hasOne(User::className(), ['id' => 'company_user_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getOrder()
    {
        return $this->hasOne(Order::className(), ['id' => 'order_id']);
    }
}
