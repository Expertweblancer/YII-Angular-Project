<?php

namespace app\models;

use yii\base\Model;

/**
 * ContactForm is the model behind the contact form.
 */
class FileForm extends Model
{
    public $imageFile;
	public $key;
    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            // name, email, subject and body are required
        		[['imageFile'], 'file', 'skipOnEmpty' => true, 'extensions' => ['jpg', 'png']],
        		[['key'], 'string']
        ];
    }
}
