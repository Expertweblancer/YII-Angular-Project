<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "invoices_manual".
 *
 * @property string $order_id
 * @property string $filename
 * @property string $created
 * @property string $num
 * @property string $comment
 *
 * @property Order $order
 */
class InvoicesManual extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'invoices_manual';
    }
	
    public function beforeSave($insert){
    		$this->created = date('Y-m-d H:i:s');

    	return true;
    }
    
    public function afterSave($insert, $changedAttributes){
    	$n 		     = new Notifications();
    	$n->data     = $this->order_id;
    	$n->category = Notifications::CAT_INVOICE_SET;
    	$n->text     = "Invoice has been set to your order!";
    	$o = Order::findOne($this->order_id);
    	$n->user_id = $o->user_id;
    	$n->save();
    }
    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['order_id', 'filename'], 'required'],
            [['order_id'], 'integer'],
            [['created'], 'safe'],
            [['filename', 'comment'], 'string', 'max' => 255],
            [['num'], 'string', 'max' => 50],
            [['order_id'], 'exist', 'skipOnError' => true, 'targetClass' => Order::className(), 'targetAttribute' => ['order_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'order_id' => 'Order ID',
            'filename' => 'Filename',
            'created' => 'Created',
            'num' => 'Num',
            'comment' => 'Comment',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getOrder()
    {
        return $this->hasOne(Order::className(), ['id' => 'order_id']);
    }
}
