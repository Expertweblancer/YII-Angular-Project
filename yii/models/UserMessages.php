<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "user_messages".
 *
 * @property string $id
 * @property integer $order_id
 * @property integer $is_attachment
 * @property integer $offeree_id
 * @property string $message
 * @property string $date_added
 * @property string $date_seen
 * @property integer $is_seen
 * @property integer $is_deleted_offeree
 * @property integer $is_deleted_order_owner
 * @property string $direction
 *
 * @property User $offeree
 */
class UserMessages extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user_messages';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['order_id', 'message', 'direction'], 'required'],
            [['order_id', 'offeree_id', 'is_seen', 'is_deleted_order_owner', 'is_deleted_offeree', 'is_attachment'], 'integer'],
            [['message'], 'string'],
            [['date_added', 'date_seen'], 'safe'],
            [['direction'], 'string', 'max' => 4],
            [['offeree_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['offeree_id' => 'id']],
        ];
    }


    /**
     * @return \yii\db\ActiveQuery
     */
    public function getOfferee()
    {
        return $this->hasOne(User::className(), ['id' => 'offeree_id']);
    }
}
