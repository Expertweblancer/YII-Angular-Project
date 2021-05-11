<?php

namespace app\controllers;

use yii\rest\ActiveController;
use app\models\Category;
use app\components\CustomCors;
use yii\filters\VerbFilter;

class CategoryController extends ActiveController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Category';
    
    /**
     * Describe controller behaviours
     * @return behaviors
     */
    public function behaviors() {
        $behaviors = parent::behaviors ();
        // add CORS filter
        $behaviors ['corsFilter'] = CustomCors::getCors ();
        
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
     * Get list of order translated categories
     * @param string $lang Language id
     * @return list of orders
     */
    public function actionList($lang = 'pl') {
        $retVal = [ ];
        $categories = Category::findAll ( [ 
                'active' => 1 
        ] );
        
        // translate categories
        foreach ( $categories as $cat ) {
            $val = null;
            $val ['id'] = $cat->id;
            $val ['text'] = \Yii::t ( 'app', $cat->text, null, $lang );
            array_push ( $retVal, $val );
        }
        return $retVal;
    }
    
    /**
     * Returns single translated category name
     * @param integer $id id of category
     * @param string $lang Language id
     *
     * @return category
     */
    public function actionViewCategory($id, $lang = 'pl') {
        $val = null;
        $cat = Category::findOne ( $id );
        $val ['id'] = $cat->id;
        
        // translate category
        $val ['text'] = \Yii::t ( 'app', $cat->text, null, $lang );
        return $val;
    }
}