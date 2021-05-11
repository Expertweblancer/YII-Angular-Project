<?php

namespace app\controllers;

use yii\rest\ActiveController;
use app\models\Category;
use app\components\CustomCors;
use yii\filters\VerbFilter;
use app\models\Order;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\CompositeAuth;
use app\models\InvoicesManual;

class InvoicesManualController extends ActiveController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\InvoicesManual';
    
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
        
        $behaviors ['verbs'] = [ 
                'class' => VerbFilter::className () 
        ];
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors ['authenticator'] ['except'] = [ 
                'options' 
        ];
        return $behaviors;
    }
    
    /**
     * Unset unnecessary REST actions
     *
     * @return actions array
     */
    public function actions() {
        $actions = parent::actions ();
        unset ( $actions ['index'] );
        unset ( $actions ['delete'] );
        return $actions;
    }
    
    /**
     * Delete invoice by order id
     *
     * @param integer $id ID of Order
     * @return empty object
     */
    public function actionDelete($id) {
        InvoicesManual::deleteAll ( [ 
                'order_id' => $id 
        ] );
        return [ ];
    }
    
    /**
     * Get list of invoices
     * 
     * @param boolean $fromCompany If request is from company user
     * @return actions array
     */
    public function actionList($fromCompany = false) {
        // construct query depending on if request is from company
        if ($fromCompany)
            $andWhere = 'company_user_id=' . \Yii::$app->user->id;
        else
            $andWhere = 'order.user_id=' . \Yii::$app->user->id . " AND invoices_manual.created IS NOT NULL";
        
        //return orders joined with invoices 
        return $order = Order::find ()->select ( 'offer.order_id, num, filename, comment, 
								title, date_execution, from_country_short, to_country_short, 
								from_address, from_city, to_city, to_address, invoices_manual.created' )->where ( [ 
                'order.status' => 'compleated',
                'offer.is_selected' => 1 
        ] )->andWhere ( $andWhere )->innerJoin ( 'offer', 'offer.order_id = order.id' )->leftJoin ( 'invoices_manual', 'order.id=invoices_manual.order_id' )->orderBy ( [ 
                'created' => SORT_ASC 
        ] )->asArray ()->all ();
    }
}