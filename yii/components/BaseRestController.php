<?php 
namespace app\components;

use yii\rest\ActiveController;

class BaseRestController extends ActiveController{
	const RESPONSE_OK = ['status'=>true,'response'=>"OK"];
	const RESPONSE_ERR= ['status'=>false,'response'=>"ERR"];
	const RESPONSE_WRONG_AUTH_DATA= ['status'=>false,'response'=>"Wrong auth data"];
	const RESPONSE_MODEL_NOT_FOUND = ['status'=>false,'response'=>"Model Not Found"];
	const RESPONSE_NEW_MODEL = ['status'=>false,'response'=>"New Model"];
	const RESPONSE_FILE_TOO_BIG = ['status'=>false,'response'=>'File too big, sorry'];
	const RESPONSE_FILE_UPLOAD_ERR = ['status'=>false,'response'=>'File upload error'];
	const RESPONSE_FILE_EXT_ERR = ['status'=>false,'response'=>'Invalid file format'];
	const RESPONSE_BAD_REQUEST = ['status'=>false,'response'=>'Bad request'];
	const RESPONSE_NO_PERMISSION = ['status'=>false,'response'=>'No permission'];
	const RESPONSE_USER_DOES_NOT_EXISTS=['status'=>false,'response'=>'User does not exists'];
	const RESPONSE_EMAIL_NOT_CONFIRMED=['status'=>false, 'response'=>'Email not confirmed'];
	const RESPONSE_EMAIL_ALREADY_CONFIRMED=['status'=>true, 'response'=>'Already Confirmed'];
	const RESPONSE_EMAIL_ALREADY_EXISTS=['status'=>false, 'response'=>'Already Exists'];
	const RESPONSE_USERNAME_ALREADY_EXISTS=['status'=>false, 'response'=>'Username Already Exists'];
	
	const STATUS_TRUE=['status'=>true];
	const STATUS_FALSE=['status'=>false];
}
?>