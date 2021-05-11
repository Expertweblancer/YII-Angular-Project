<?php

namespace app\controllers;

use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\VerbFilter;
use app\components\BaseRestController;
use app\components\CustomCors;
use app\models\User;
use Yii;
use app\models\Notifications;

class NotificationsController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Notifications';
    
    /**
     * Describe controller behaviours
     *
     * @return object Controller Behaviors
     */
    public function behaviors() {
        $behaviors = parent::behaviors ();
        
        // remove authentication filter
        $auth = $behaviors ['authenticator'];
        unset ( $behaviors ['authenticator'] );
        
        // add CORS filter
        $behaviors ['corsFilter'] = CustomCors::getCors ();
        
        // re-add authentication filter
        $behaviors ['authenticator'] = [ 
                'class' => CompositeAuth::className (),
                'authMethods' => [ 
                        HttpBearerAuth::className () 
                ] 
        ];
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors ['authenticator'] ['except'] = [ 
                'options' 
        ];
        
        $behaviors ['verbs'] = [ 
                'class' => VerbFilter::className () 
        ];
        return $behaviors;
    }
    
    /**
     * Unset unnecessary REST actions
     *
     * @return array Actions
     */
    public function actions() {
        $a = parent::actions ();
        unset ( $a ['index'] );
        unset ( $a ['delete'] );
        return $a;
    }
    
    /**
     * List of notifications
     *
     * @return object[] Array of notifications
     */
    public function actionIndex() {
        \Yii::$app->response->format = \yii\web\Response::FORMAT_JSON;
        $uid = \Yii::$app->user->id;
        $all = Notifications::find ()->where ( [ 
                'notifications.user_id' => $uid 
        ] )->orderBy ( [ 
                'created' => SORT_DESC 
        ] )->select ( 'notifications.*, order.title' )->leftJoin ( 'order', 'order.id=order_id' )->asArray ()->all ();
        
        // set all unread notifications as read
        Notifications::updateAll ( [ 
                'read' => 1 
        ], "`user_id`=$uid AND `read`=0" );
        return $all;
    }
    
    /**
     * Delete notifications
     *
     * @return array Actions
     */
    public function actionDelete($id) {
        if (1 === Notifications::deleteAll ( [ 
                'id' => $id,
                'user_id' => \Yii::$app->user->id 
        ] )) {
            return self::RESPONSE_OK;
        }
        return self::RESPONSE_MODEL_NOT_FOUND;
    }
    
    /**
     * Get number of unread notifications
     *
     * @return object Object with number of unread notifcations
     */
    public function actionGetNumOfUnread() {
        // get current loggedin user id
        $uid = \Yii::$app->user->id;
        
        // get number of notifications
        $num = Notifications::find ()->where ( [ 
                'user_id' => $uid,
                'read' => 0 
        ] )->count ();
        
        return self::RESPONSE_OK + [ 
                'num' => $num 
        ];
    }
}