<?php
namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\models\Parcel;
use app\components\CustomCors;
use app\models\Order;
use app\components\BaseRestController;

class ParcelController extends BaseRestController
{
	// adjust the model class to match your model
	public $modelClass = 'app\models\Parcel';
	
	/*
	 * Describe controller behaviours
	 *
	 * @return object Controller Behaviors
	 */
	public function behaviors(){
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
		unset($a['delete']);
		unset($a['update']);
		unset($a['view']);
		return $a;
	}
	
	
	/*
	 * Save multiple Parcel Objects
	 * 
	 * @param integer $oid Order ID
	 * 
	 * @return object Action Status
	 */
	public function actionCreateMultiple($oid){
		if ($post = \Yii::$app->request->post())
		{
			if (!Order::findOne(['id'=>$oid, 'user_id'=>\Yii::$app->user->id]))
				return self::RESPONSE_BAD_REQUEST;
			$data = json_decode(json_encode($post));
			if (count($data)>0)
				foreach ($data as $p){
					$parcel = new Parcel();
					$parcel->order_id = $oid;
					$parcel->height = $p->height;
					$parcel->width = $p->width;
					$parcel->depth = $p->depth;
					$parcel->weight = $p->weight;
					$parcel->save();
				}
			return self::RESPONSE_OK;
		}
	}
	
	/*
	 * Delete of parcels by id
	 *
	 * @param integer $oid Order ID
	 *
	 * @return object Action Status
	 */
	public function actionDel($id){
		return Parcel::deleteAll("order_id = $id");
	}
	
	/*
	 * Get Parcel List by Order ID
	 *
	 * @param integer $oid Order ID
	 *
	 * @return object[] List of Parcels
	 */
	public function actionView($id){
		return Parcel::findAll(['order_id'=>$id]);
	}
}