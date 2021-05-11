<?php

namespace app\controllers;

use yii\rest\ActiveController;
use app\models\Category;
use app\components\CustomCors;
use yii\filters\VerbFilter;
use app\models\Complaint;

class ComplaintController extends ActiveController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Complaint';
    
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
        
        $behaviors ['verbs'] = [ 
                'class' => VerbFilter::className () 
        ];
        
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors ['authenticator'] = $auth;
        
        return $behaviors;
    }
    
    /**
     * Unset unnecessary REST actions
     *
     * @return actions array
     */
    public function actions() {
        $a = parent::actions ();
        unset ( $a ['delete'] );
        return $a;
    }
    
    /**
     * Set action after any REST request
     * @param string $action Action name
     * @param string $result Action result
     */
    public function afterAction($action, $result) {
        if ($action->id == 'create') {
            $complaint = Complaint::find ()->select ( 'complaint.*, user.email' )->orderBy ( [ 
                    'order_id' => SORT_DESC 
            ] )->innerJoin ( 'order', 'order.id=order_id' )->innerJoin ( 'user', 'user.id=order.user_id' )->limit ( 1 )->asArray ()->one ();
            
            // send email after action
            \Yii::$app->mailer->compose ( '@app/mail/complaint', [ 
                    'message' => $complaint ['message'],
                    'id' => $complaint ['order_id'],
                    'not_realized' => $complaint ['not_realized'],
                    'email' => $complaint ['email'] 
            ] )->setFrom ( [ 
                    \Yii::$app->params ['adminEmail'] => \Yii::t ( 'app', 'Snarto Admin' ) 
            ] )->setTo ( [ 
                    'jacek.stanusz@gmail.com',
                    'admin@snarto.com' 
            ] )->setSubject ( \Yii::t ( 'app', 'Complaint to order: ' . $complaint ['order_id'] ) )->send ();
        }
    }
}
