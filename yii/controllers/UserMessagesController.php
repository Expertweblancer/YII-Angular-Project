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
    	
    	$behaviors['verbs'] = [
    		'class' => VerbFilter::className(),
		];    	
    	return $behaviors;
    }
    
    /*
     * Send Message
     *
     * @return array Actions
     */
    public function actionSend(){
    	if ($post = \Yii::$app->request->post())
    	{
    		$data = json_decode(json_encode($post));
    		$uid = \Yii::$app->user->id;
    		
    		$oid = null;
    		if (isset($data->order_id))
    			$oid = $data->order_id;
    		$token;
    		if (isset($data->order_id))
    			$token = $data->token;
    				
    		$off_id= null;
    		if (isset($data->offeree_id))
    			$off_id = $data->offeree_id;
    		
    		$msg = null;
    		if (isset($data->message))
    			$msg = $data->message;

    		$isAttachment = 0;
    		if (isset($data->is_attachment))
    			$isAttachment= $data->is_attachment;
    				
    			
    			
    		if (!$oid || !$msg )
    			return self::RESPONSE_BAD_REQUEST;
    		
    			
    		
    		$order = Order::find()->select('user_id')->where("id=$oid AND token='$token'")->one();
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
    		$usermsg->is_attachment = $isAttachment;
    		
			$usermsg->direction = $direction;
    		if ($usermsg->save()){
    			$usermsg->refresh();
    			return $usermsg;
    		}
    	} else
    		return self::STATUS_FALSE + self::RESPONSE_BAD_REQUEST;
    	return self::STATUS_FALSE + self::RESPONSE_ERR;
    }

    /*
     * Mark Message as read
     *
     * @return object Action Status
     */
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

    /*
     * Delete Message
     *
     * @return object Action Status
     */
    public function actionMarkAsDeleted($mid, $token, $ico /*from company*/)
    {
    	$message = UserMessages::find()->select('offeree_id, user_messages.id as UM_id, order_id as oid, order.user_id as uid')->innerJoin('order', 'order_id = order.id')->where(['user_messages.id' => $mid, 'token' => $token])->asArray()->one();
    	
    	if (!$message)
    		return self::RESPONSE_MODEL_NOT_FOUND + ['msg'=>'probably something wrong with token'];
    	$uid = \Yii::$app->user->id;
    	
    	if ($ico){
    		if ($message['offeree_id']!=$uid)
    			return self::RESPONSE_MODEL_NOT_FOUND + ['msg'=>'offeree id is wrong'];
    		$isDeleted = 'is_deleted_offeree';
    	}
    	else {
    		if ($message['uid']!=$uid)
    			return self::RESPONSE_MODEL_NOT_FOUND + ['msg'=>'order owner id is wrong'];
    		$isDeleted = 'is_deleted_order_owner';
    	}
    	$model =  UserMessages::find()->where("id <= $mid AND `$isDeleted` = 0 AND `order_id` = ".$message['oid'])->all();
    	foreach ($model as $msg) {
    		$msg->{$isDeleted}= 1 ;
    		$msg->save();
    	}
    	return self::RESPONSE_OK;
    }
    
    /*
     * Get Number of unread messages
     * 
     * @param booleand $ico Logged in user has company profile?
     * @return object Action Status
     */
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
    
    /*
     * Get Number of unread messages
     *
     * @param integer $oid Order ID?
     * @param string $token Order token
     * @param integer $uid Id of user
     * @param booleand $ico Logged in user has company profile?
     * @return object Action Status
     */
    public function actionGetByOrderId($oid, $token, $uid, $ico){
		$direction = '';
    	if ($ico){
			$messages = UserMessages::find()->select('user_messages.*, customer_profile.name, customer_profile.surname, user.username')
				->where("offeree_id=$uid AND order_id=$oid AND order.token='$token' AND is_deleted_offeree=0")
				->innerJoin('order', 'user_messages.order_id = order.id')
				->innerJoin('user', 'order.user_id = user.id')
				->leftJoin('customer_profile', 'customer_profile.user_id=order.user_id')
				->asArray()->all();
			$dir = 'from';
		}
		else {
    		$messages = UserMessages::find()->select('user_messages.*, company_profile.name as company_name, customer_profile.name, customer_profile.surname, user.username')
    		->where("offeree_id=$uid AND order_id=$oid AND order.token='$token' AND is_deleted_order_owner=0")
 				->innerJoin('order', 'order.id=order.id')
  				->innerJoin('user', 'user.id=offeree_id')
   				->leftJoin('customer_profile', 'customer_profile.user_id=user.id')
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
    
    /*
     * Get List of messages
     *
     * @param booleand $ico If request is from user having company profile 
     * @return object Action Status
     */
    public function actionGetList($ico)
    {
    	$uid=\Yii::$app->user->id;
    	
    	if ($ico)
    	{
    		$um = UserMessages::find()->select("MAX(id) AS id")->where(['offeree_id'=>$uid, 'is_deleted_offeree'=>0])->groupBy('order_id, offeree_id')->asArray()->all();
    	} else{
    		
    		$orders = Order::find()->select('id')->where("user_id=$uid")->all();
    		$uids = Helpers::mapModel($orders, 'id');
    		
    		$um = UserMessages::find()->select("MAX(id) AS id")->where(['order_id'=>$uids, 'is_deleted_order_owner'=>0])->groupBy('order_id, offeree_id')->asArray()->all();
    		
    	}
    	
    	$ids = Helpers::mapModel($um, 'id');
    	
 	
    	$messages = UserMessages::find()->select("user_messages.*, order.title, user.id as owner_id, order.token")
    				->innerjoin('order', 'order.id=order_id')->innerJoin('user', 'order.user_id=user.id')
    				->where(['user_messages.id'=> $ids])->orderBy(['date_added'=>SORT_DESC])
    				->asArray()->all();
    	
    	for ($i=0; $i<count($messages); $i++){
    		$searchedUserId = $uid!=$messages[$i]['offeree_id']?$messages[$i]['offeree_id']:$messages[$i]['owner_id'];
    		
    		$u = User::find()->select('customer_profile.name, customer_profile.surname, company_profile.name as company_name')->leftJoin('customer_profile', 'customer_profile.user_id = user.id')
    			->leftJoin('company_profile', 'company_profile.id=user.id_company_profile')->where(['user.id'=> $searchedUserId])->asArray()->one();
    		//$displayName = $u->getHasCompanyProfile()?
    		$messages[$i]['surname'] = $u['surname'];
    		$messages[$i]['name'] = $u['name'];
    		$messages[$i]['company_name'] = $u['company_name'];
    		
    	}
    	
    	return $messages;
    }
}