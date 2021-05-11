<?php

namespace app\controllers\restapi;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\components\CustomCors;
use app\helpers\Helpers;
use app\models\Parcel;
use app\components\BaseRestController;

class SearchOrderController extends BaseRestController
{
	public $modelClass = 'app\models\Order';
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
	
	
	public function actionSearch(){
		\Yii::$app->response->format=\yii\web\Response::FORMAT_JSON;

		if ($post = \Yii::$app->request->post())
		{
			$R = 6371; //długosc obwodu ziemi
			$data = json_decode(json_encode($post));
			if (isset($data->{'from_lat'}) && isset($data->{'from_lng'})&&isset($data->{'from_lat'}) && isset($data->{'from_lng'})&& isset($data->{'distance'}) && isset($data->{'total_km'}))
			{	
				$distance = $data->{'distance'};
				$total_km = $data->{'total_km'};
				
				$from_lat = $data->{'from_lat'};
				$to_lat   = $data->{'to_lat'};
				
				$from_lng = $data->{'from_lng'};
				$to_lng	  = $data->{'to_lng'};
				
				
				$lat = ($data->{'from_lat'}+$data->{'to_lat'})/2;
				$lng = ($data->{'from_lng'}+$data->{'to_lng'})/2;
				$query = "SELECT *, ( $R * ACOS(
	        	    COS( RADIANS( $lat ) ) *
    	        	COS( RADIANS( `from_lat` ) ) *
        	    	COS(RADIANS( `from_long` ) - RADIANS( $lng )) + 
					SIN(RADIANS($lat)) * SIN(RADIANS(`from_lat`)))) `distance` 
					FROM `order` HAVING `distance` < $distance ORDER BY `distance`";
				
				$connection = \Yii::$app->db;
				$command = $connection->createCommand($query);
				$orders = $command->queryAll();
				
				$retVal = [];
				$retVal['orders']=[];
				foreach($orders as $o){
					$pdist = Helpers::checkDistance($from_lat, $from_lng, $to_lat, $to_lng, $o['from_lat'], $o['from_long'], $o['to_lat'], $o['to_long']);
					$o['parcels']=Parcel::find()->where(['order_id'=>$o['id']])->all();
					if ($pdist<$total_km) array_push($retVal['orders'], $o);
				}
				

				return $retVal + self::RESPONSE_OK;
			} else
				return self::RESPONSE_BAD_REQUEST;	
		}
		
		return self::RESPONSE_BAD_REQUEST;
	}
}
