<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "change_log".
 *
 * @property integer $id
 * @property string $date
 * @property string $message
 * @property integer $id_user
 */
class ChangeLog extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'change_log';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['date'], 'safe'],
            [['message', 'id_user'], 'required'],
            [['message'], 'string'],
            [['id_user'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'date' => 'Date',
            'message' => 'Message',
            'id_user' => 'Id User',
        ];
    }
}
