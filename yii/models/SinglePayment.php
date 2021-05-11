<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "single_payment".
 *
 * @property integer $id
 * @property integer $order_id
 * @property string $session_id
 * @property string $p24_oid
 * @property string $return_url
 * @property string $amount
 * @property string $paid_amount
 * @property string $created
 * @property string $confirmed
 * @property integer $success
 */
class SinglePayment extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'single_payment';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['order_id', 'session_id'], 'required'],
            [['order_id', 'success', 'confirmed'], 'integer'],
            [['amount', 'paid_amount'], 'number'],
            [['created'], 'safe'],
            [['session_id'], 'string', 'max' => 100],
        	[['return_url', 'p24_oid'], 'string', 'max' => 255],
        ];
    }
	public function beforeValidate()
	{
		if (!$this->session_id)
			$this->session_id = uniqid();
		return true;
	}
}
