<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "order_attachments".
 *
 * @property integer $id
 * @property integer $id_order
 * @property string $name
 */
class OrderAttachments extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'order_attachments';
    }
	
    public function beforeSave($insert){
		$o = Order::findOne($this->id_order);
		if (!$o)
			return false;
		
    	if ($o->user_id === \Yii::$app->user->id){
			return true;    		
    	}
    	return false;
    }
    
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id_order', 'name'], 'required'],
            [['id_order'], 'integer'],
            [['name'], 'string', 'max' => 100],
        ];
    }
}
