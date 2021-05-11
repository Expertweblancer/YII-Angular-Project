<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "user_settings".
 *
 * @property integer $id_user
 * @property string $setting
 * @property string $value
 */
class UserSettings extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user_settings';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id_user', 'setting'], 'required'],
            [['id_user'], 'integer'],
            [['setting'], 'string', 'max' => 20],
            [['value'], 'string', 'max' => 200],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id_user' => Yii::t('app', 'Id User'),
            'setting' => Yii::t('app', 'Setting'),
            'value' => Yii::t('app', 'Value'),
        ];
    }
}
