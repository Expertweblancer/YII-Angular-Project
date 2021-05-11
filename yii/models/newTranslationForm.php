<?php

namespace app\models;

use yii\base\Model;

/**
 * ContactForm is the model behind the contact form.
 */
class newTranslationForm extends Model
{
    public $message;
    public $lang;
    public $translation;

    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            // name, email, subject and body are required
            [['message', 'translation', 'lang'], 'required'],
        ];
    }
}
