<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "time_from_to_order".
 *
 * @property string $time_from
 * @property string $time_to
 * @property integer $id_order
 * @property string $date
 */
class TimeFromToOrder extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'time_from_to_order';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['time_from', 'time_to', 'id_order', 'date'], 'required'],
            [['time_from', 'time_to', 'date'], 'safe'],
            [['id_order'], 'integer'],
        ];
    }
}
