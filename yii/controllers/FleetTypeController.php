<?php

namespace app\controllers;

use yii\filters\VerbFilter;
use app\components\BaseRestController;
use app\components\CustomCors;
use app\models\FleetType;

class FleetTypeController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\FleetType';
    
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
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        
        $behaviors ['verbs'] = [ 
                'class' => VerbFilter::className () 
        ];
        return $behaviors;
    }
    
    /**
     * Unset unnecessary REST actions
     *
     * @return actions array
     */
    public function actions() {
        $a = parent::actions ();
        unset ( $a ['index'] );
        unset ( $a ['delete'] );
        unset ( $a ['update'] );
        unset ( $a ['create'] );
        unset ( $a ['view'] );
    }
    
    /**
     * Get translated fleet types
     *
     * @param string $lang Language code
     *
     * @return object[] Types of fleet
     */
    public function actionList($lang = 'pl') {
        $retVal = [ ];
        
        // take only visible types
        $types = FleetType::findAll ( [ 
                'visible' => 1 
        ] );
        
        // translate and assign values to return variable
        foreach ( $types as $type ) {
            $val = null;
            $val ['id'] = $type->id;
            $val ['name'] = \Yii::t ( 'app', $type->name, null, $lang );
            array_push ( $retVal, $val );
        }
        return $retVal;
    }
    
    /**
     * Get single translated fleet type
     *
     * @param integer $id Fleet Type
     * @param string $lang Language code
     *
     * @return object Single fleet type
     */
    public function actionViewFleetType($id, $lang = 'pl') {
        $val = null;
        
        $type = FleetType::findOne ( $id );
        
        $val ['id'] = $type->id;
        $val ['name'] = \Yii::t ( 'app', $type->name, null, $lang );
        
        return $val;
    }
}