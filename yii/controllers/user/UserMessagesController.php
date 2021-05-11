<?php
namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use app\models\Order;
use app\models\Parcel;
use yii\filters\VerbFilter;
use app\models\Message;
use app\components\BaseRestController;
use app\components\CustomCors;
use app\models\User;
use app\models\UserMessages;
use Yii;
use app\helpers\Helpers;

class UserMessagesController extends BaseRestController
{
	const DIRECTION_FROM = "from";
	const DIRECTION_TO = "to";
	// adjust the model class to match your model
    public $modelClass = 'app\models\UserMessages';
    public function behaviors()
    {
    	$behaviors = parent::behaviors();
    	 
    	// remove authentication filter
    	$auth = $behaviors['authenticator'];
    	unset($behaviors['authenticator']);
    	 
    	// add CORS filter
    	$behaviors['corsFilter'] = [
    			'class' => CustomCors::className()
    	];
    	 
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
    
    public function actionSend(){
    	if ($post = \Yii::$app->request->post())
    	{
    		$data = json_decode(json_encode($post));
    		$uid = \Yii::$app->user->id;
    		
    		$oid = null;
    		if (isset($data->order_id))
    			$oid = $data->order_id;
			
    		$off_id= null;
    		if (isset($data->offeree_id))
    			$off_id = $data->offeree_id;
    		
    		$msg = null;
    		if (isset($data->message))
    			$msg = $data->message;
    			
    		if (!$oid || !$msg )
    			return self::RESPONSE_BAD_REQUEST;
    		
    			
    		
    		$order = Order::find()->select('user_id')->where("id=$oid")->one();
    		if (!$order)
    			return self::RESPONSE_BAD_REQUEST;
    		
    		$orderOwnerId = $order->user_id;

    		if (!$off_id && $orderOwnerId==$uid)
    			return self::RESPONSE_BAD_REQUEST + ['err'=>'if no offeree id than user cannot send message to himself, order owner and sender must have different id'];
			if (!$off_id) {
				$off_id = $uid;
				$direction = self::DIRECTION_TO;
			}
    		else {
    			if (!User::findOne($off_id))
    				return self::RESPONSE_USER_DOES_NOT_EXISTS+['err'=>'wrong offeree id, no user found'];
    			$direction = self::DIRECTION_FROM;
    		}
    		$usermsg = new UserMessages();

    		$usermsg->order_id = $oid;
    		$usermsg->message = $msg;
    		$usermsg->offeree_id = $off_id;
    		
			$usermsg->direction = $direction;
    		if ($usermsg->save()){
    			$usermsg->refresh();
    			return $usermsg;
    		}
    	} else
    		return self::STATUS_FALSE + self::RESPONSE_BAD_REQUEST;
    	return self::STATUS_FALSE + self::RESPONSE_ERR;
    }

    public function actionMarkAsRead($mid)
    {
    	$model =  UserMessages::findOne($mid);
    	if ($model) {
    		$model->date_seen=date("Y-m-d G:i:s");
    		$model->save();
    		return $model;
    	} else
    		return self::STATUS_FALSE+self::RESPONSE_MODEL_NOT_FOUND;
      }
    
    public function actionGetNumOfUnread($ico)
    {
    	$uid = \Yii::$app->user->id;
    	if ($ico){
    		$num = UserMessages::find()->where("offeree_id=$uid AND direction='from'")->andWhere(['date_seen'=>null])->count();
    	}else{
      		$orders = Order::find()->select('id')->where(['user_id'=>$uid])->all();
      		if(!$orders)
      			return self::RESPONSE_OK + ['num' => 0];
      		$ids = Helpers::mapModel($orders, 'id');
      		$num = UserMessages::find()->where(['order_id'=>$ids, 'date_seen'=>null, 'direction'=>'to'])->count();
      	}
    	return self::RESPONSE_OK + ['num' => $num];
    }
    
    public function actionGetByOrderId($oid, $uid, $ico){
		$direction = '';
    	if ($ico){		
			$messages = UserMessages::find()->select('user_messages.*, profile.name, profile.surname, user.username')
				->where("offeree_id=$uid AND order_id=$oid")
				->innerJoin('order', 'user_messages.order_id = order.id')
				->innerJoin('user', 'order.user_id = user.id')
				->leftJoin('profile', 'profile.user_id=order.user_id')
				->asArray()->all();
			$dir = 'from';
		}
		else {
    		$messages = UserMessages::find()->select('user_messages.*, company_profile.name as company_name, profile.name, profile.surname, user.username')
 				->where("offeree_id=$uid AND order_id=$oid")
  				->innerJoin('user', 'user.id=offeree_id')
   				->leftJoin('profile', 'profile.user_id=user.id')
   				->innerJoin('company_profile', 'company_profile.id=user.id_company_profile')
   				->asArray()->all();
   			$dir = 'to';	
		}

		foreach ($messages as $msg)
			if ($msg['direction']==$dir && !$msg['date_seen']){
				$m = UserMessages::findOne($msg['id']);
				$m->date_seen = date("Y-m-d G:i:s");
				$m -> save();
			}

   		return $messages;
    }
    
    public function actionGetList($ico)
    {
    	//SELECT MAX(id) FROM user_messages WHERE order_id=41 GROUP BY order_id, offeree_id 
    	$uid=\Yii::$app->user->id;
    	
    	if ($ico)
    	{
    		$um = UserMessages::find()->select("MAX(id) AS id")->where("offeree_id=$uid")->groupBy('order_id, offeree_id')->asArray()->all();
    	} else{
    		
    		$orders = Order::find()->select('id')->where("user_id=$uid")->all();
    		$uids = Helpers::mapModel($orders, 'id');
    		
    		$um = UserMessages::find()->select("MAX(id) AS id")->where(['order_id'=>$uids])->groupBy('order_id, offeree_id')->asArray()->all();
    		
    	}
    	
    	$ids = Helpers::mapModel($um, 'id');
    	
 	
    	$messages = UserMessages::find()->select("user_messages.*, order.title, user.id as owner_id")
    				->innerjoin('order', 'order.id=order_id')->innerJoin('user', 'order.user_id=user.id')
    				->where(['user_messages.id'=> $ids])
    				->asArray()->all();
    	
    	for ($i=0; $i<count($messages); $i++){
    		$searchedUserId = $uid!=$messages[$i]['offeree_id']?$messages[$i]['offeree_id']:$messages[$i]['owner_id'];
    		
    		$u = User::find()->select('profile.name, profile.surname, company_profile.name as company_name')->leftJoin('profile', 'profile.user_id = user.id')
    			->leftJoin('company_profile', 'company_profile.id=user.id_company_profile')->where(['user.id'=> $searchedUserId])->asArray()->one();
    		//$displayName = $u->getHasCompanyProfile()?
    		$messages[$i]['surname'] = $u['surname'];
    		$messages[$i]['name'] = $u['name'];
    		$messages[$i]['company_name'] = $u['company_name'];
    		
    	}
    	
    	return $messages;
    }
}