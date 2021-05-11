<?php
namespace app\controllers;

use yii\rest\ActiveController;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\models\Order;
use app\models\Parcel;
use yii\filters\VerbFilter;
use app\components\CustomCors;


class ChatController extends ActiveController
{
    // adjust the model class to match your model
    public $modelClass = 'app\models\UserSettings';
    public function behaviors()
    {
    	$behaviors = parent::behaviors();
    	 
    	// remove authentication filter
    	$auth = $behaviors['authenticator'];
    	unset($behaviors['authenticator']);
    	 
    	// add CORS filter
    	$behaviors['corsFilter'] = CustomCors::getCors();
    	
    	 
    	// re-add authentication filter
    	$behaviors['authenticator'] = [
    			'class' => CompositeAuth::className(),
    			'authMethods' => [
    					HttpBearerAuth::className(),
    			],
    	];
    	// avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
    	$behaviors['authenticator']['except'] = ['options'];
    	
    	$behaviors['verbs'] = [
    		'class' => VerbFilter::className(),
		];    	
    	return $behaviors;
    }
    public function actionSet(){
    	
    }
    public function actionGet(){
    	 
    }
}