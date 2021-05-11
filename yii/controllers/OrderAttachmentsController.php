<?php
namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\components\CustomCors;
use app\components\BaseRestController;
use app\models\OrderAttachments;
use app\models\Order;


class OrderAttachmentsController extends BaseRestController
{
    // adjust the model class to match your model
    public $modelClass = 'app\models\OrderAttachments';
    
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
    			'class' => CompositeAuth::className(),
    			'authMethods' => [
    					HttpBearerAuth::className(),
    			],
    	];
    	// avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
    	$behaviors['authenticator']['except'] = ['options'];   	
    	return $behaviors;
    }
    
    /*
     * Unset unnecessary REST actions
     *
     * @return array Actions
     */
    public function actions(){
    	$a = parent::actions();
    	unset($a['create']);
    	unset($a['delete']);
    	unset($a['update']);
    	unset($a['view']);
    	return $a;
    }
    
    /*
     * Delete Order Attachments
     * 
     * @param integer $oid Order ID
     * 
     * @return object Operation status
     */
    public function actionDeleteAll($oid){
		$o = Order::findOne(['id'=>$oid, 'user_id'=>\Yii::$app->user->id]);
		if ($o){
			OrderAttachments::deleteAll(['order_id'=>$oid]);
			return self::RESPONSE_OK;
		} else 
			return self::RESPONSE_NO_PERMISSION;
    }
    
    /*
     * Delete Order Attachments
     *
     * @return object Operation status
     */
    public function actionCreate(){
    	\Yii::$app->response->format=\yii\web\Response::FORMAT_JSON;
    	
    	if ($post = \Yii::$app->request->post())
    	{
    		$data = json_decode(json_encode($post));
    		// delete all attachments
    		OrderAttachments::deleteAll(['id_order'=>$data[0]->id_order]);
    		
    		//and than set new attachments
    		foreach ($data as $el)
    		{
    			$o = new OrderAttachments();
    			$o->name = $el->name;
    			$o->id_order = $el->id_order;
    			if (!$o->save())
    				return self::RESPONSE_BAD_REQUEST+['couldnt save', $el->id_order, $el->name, $o->errors];
    		}
    		return self::RESPONSE_OK;
    	}
    	return self::RESPONSE_BAD_REQUEST;
    }
    
    /*
     * Get Order Attachments
     *
     * @param integer $id Order ID
     * 
     * @return object Operation status
     */
    public function actionView($id){
    	return OrderAttachments::findAll(['id_order'=>$id]);
    }
}