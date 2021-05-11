<?php
namespace app\controllers;

use yii\rest\ActiveController;
use app\components\CustomCors;
use yii\filters\VerbFilter;
use app\models\SinglePayment;

class SinglePaymentController extends ActiveController
{
    // adjust the model class to match your model
    public $modelClass = 'app\models\SinglePayment';
    public function behaviors()
    {
    	$behaviors = parent::behaviors();
    	
    	// remove authentication filter
    	$auth = $behaviors['authenticator'];
    	unset($behaviors['authenticator']);
    	
    	// add CORS filter
    	$behaviors['corsFilter'] = CustomCors::getCors();
    	
    	
    	$behaviors['verbs'] = [
    			'class' => VerbFilter::className(),
    	];
    	
    	// avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
    	$behaviors['authenticator']=$auth;
    	
    	return $behaviors;  
    }
    public function actions(){
    	$a = parent::actions();
    	unset($a['view']);
    	return $a;
    }
    public function actionGet($id){
    	return SinglePayment::findOne(['session_id'=>$id]);
    }
	
}