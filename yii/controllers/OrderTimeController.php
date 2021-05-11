<?php
namespace app\controllers;


use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\components\CustomCors;
use app\components\BaseRestController;
use app\models\OrderAttachments;
use app\models\OrderTime;
use yii\filters\VerbFilter;


class OrderTimeController extends BaseRestController
{
    // adjust the model class to match your model
    public $modelClass = 'app\models\OrderTime';
    
    /*
     * Describe controller behaviours
     *
     * @return object Controller Behaviors
     */
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
    			'except' => ['get',],
    			'class' => CompositeAuth::className(),
    			'authMethods' => [
    					HttpBearerAuth::className(),
    			],
    	];
    	
    	$behaviors['verbs'] = [
    			'class' => VerbFilter::className(),
    	];
    	return $behaviors;
    }
    
    /*
     * Unset unnecessary REST actions
     *
     * @return array Actions
     */
    public function actions(){
    	$a = parent::actions();
    	unset($a['delete']);
    	unset($a['view']);
    	return $a;
    }
    
    
    /*
     * Delete Order Time record
     * 
     * @param integer $id ID of Order Time Record
     * @return status of action
     */
    public function actionDel($id){
    	return OrderTime::deleteAll("id_order = $id");
    }
    
    /*
     * Get Order Time
     *
     * @param integer $id Order Time ID
     * @return object Order Time
     */
    public function actionGet($id){
    	\Yii::$app->response->format=\yii\web\Response::FORMAT_JSON;
    	$ot = OrderTime::findOne(["id_order"=>$id]);
    	return $ot?$ot:[];
    }
}