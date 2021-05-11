<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "address".
 *
 * @property string $id
 * @property string $address1
 * @property string $address2
 * @property string $postal
 * @property string $city
 * @property integer $id_country
 */
class Address extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'address';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['address1', 'postal', 'city', 'id_country'], 'required'],
            [['id_country'], 'integer'],
            [['address1', 'address2', 'city'], 'string', 'max' => 40],
            [['postal'], 'string', 'max' => 20],
        ];
    }
}
