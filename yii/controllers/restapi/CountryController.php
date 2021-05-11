<?php
namespace app\controllers\restapi;

use app\models\Country;
use app\components\CustomCors;
use app\components\BaseRestController;

class CountryController extends BaseRestController
{
    // adjust the model class to match your model
    public $modelClass = 'app\models\Country';
    public function behaviors()
    {
    	$behaviors = parent::behaviors();
    
    	// remove authentication filter
    	$auth = $behaviors['authenticator'];
    	unset($behaviors['authenticator']);
    
    	// add CORS filter
    	$behaviors['corsFilter'] = CustomCors::getCors();
    	
    
    	// re-add authentication filter
    	$behaviors['authenticator'] = $auth;
    	// avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
    	$behaviors['authenticator']['except'] = ['options'];
    
    	return $behaviors;
    }
    public function actionGetCountry($id)
    {
    	return Country::findOne($id);
    }
    public function actionGetCountries(){
    	\Yii::$app->response->format=\yii\web\Response::FORMAT_JSON;
    	return Country::find()->all();
    }
}