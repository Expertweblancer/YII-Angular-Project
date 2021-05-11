<?php

namespace app\models;

use Yii;
use app\helpers\Helpers;

/**
 * This is the model class for table "order".
 *
 * @property string $id
 * @property integer $user_id
 * @property string $title
 * @property integer $category_id
 * @property string $from_city
 * @property string $from_country_short
 * @property string $from_address
 * @property string $from_lat
 * @property string $from_long
 * @property string $date_from
 * @property string $to_city
 * @property string $to_country_short
 * @property string $to_address
 * @property string $to_lat
 * @property string $to_long
 * @property string $distance
 * @property string $info
 * @property string $date_to
 * @property string $date_added
 * @property string $date_modified
 * @property string $date_paid
 * @property string $date_completed
 * @property string $date_deleted
 * @property integer $is_active
 * @property integer $is_selected
 * @property integer $is_paid
 * @property integer $is_completed
 * @property integer $is_deleted
 * @property integer $payment_type_id
 * @property integer $currency_id
 * @property string $status
 * @property integer $trustee_id
 */
class Order extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'order';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'trustee_id', 'category_id', 'distance', 'is_active', 'is_selected', 'is_paid', 'is_completed', 'is_deleted', 'payment_type_id', 'currency_id'], 'integer'],
            [['from_address', 'to_address', 'payment_type_id', 'currency_id'], 'required'],
            [['from_lat', 'from_long', 'to_lat', 'to_long'], 'number'],
            [['date_from', 'date_to', 'date_added', 'date_modified', 'date_paid', 'date_completed', 'date_deleted'], 'safe'],
            [['info'], 'string'],
            [['status'], 'string', 'max' => 12],
            [['title', 'from_city', 'from_address', 'to_city', 'to_address'], 'string', 'max' => 255],
            [['from_country_short', 'to_country_short'], 'string', 'max' => 5],
            [['token'], 'string', 'max' => 30],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    public function beforeSave($insert){
    	if ($insert && \Yii::$app->user->identity->isConfirmed)
    		$this->is_active = 1;
    	
    	if ($insert && \Yii::$app->user->identity->isTrustee){
    		$this->trustee_id = \Yii::$app->user->id;
    	}
    	if (!$this->token)
    		$this->token=Helpers::uniqueId(time()).Helpers::uniqueId();
   		$this->date_modified = date('Y-m-d H:i:s');
    	return true;
    }
    
    public function afterSave($insert, $changedAttributes){
        if ($insert)
	        \Yii::$app->mailer->compose('@app/mail/order_confirmation', [
	            'order'=>$this, 'username'=>$this->user->username])
	        ->setTo($this->user->email)
	        ->setFrom([Yii::$app->params['adminEmail'] => \Yii::$app->name])
	        ->setSubject(\Yii::t('app', 'Order successfully created', [\Yii::$app->name]) )
	        ->send();
    }

    public function beforeValidate(){
    	if (!$this->user_id)
    		$this->user_id = Yii::$app->user->id;
    	return true;
    }
    public function beforeDelete(){
    	if (\Yii::$app->user->identity->isAdmin || \Yii::$app->user->identity->isTrustee || $this->user_id === \Yii::$app->user->id)
    		return true;
    		return false;
    }

        /**
     * @return \yii\db\ActiveQuery
     */
    public function getInvoicesManual()
    {
        return $this->hasOne(InvoicesManual::className(), ['order_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getOffers()
    {
        return $this->hasMany(Offer::className(), ['order_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCompanyUsers()
    {
        return $this->hasMany(User::className(), ['id' => 'company_user_id'])->viaTable('offer', ['order_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }
}
