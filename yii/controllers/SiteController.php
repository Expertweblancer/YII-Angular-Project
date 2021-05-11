<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use app\models\ContactForm;
use app\models\User;
use dektrium\user\helpers\Password;

class SiteController extends Controller {    
    /**
     * @inheritdoc
     */
    public function actions() {
        return [ 
                'error' => [ 
                        'class' => 'yii\web\ErrorAction' 
                ] 
        ];
    }
    
    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex() {
        return $this->render ( 'about' );
    }
    /**
     * Logout action.
     *
     * @return string
     */
    public function actionLogout() {
        Yii::$app->user->logout ();
        
        return $this->goHome ();
    }
    
    /**
     * Displays contact page.
     *
     * @return string
     */
    public function actionContact() {
        $model = new ContactForm ();
        if ($model->load ( Yii::$app->request->post () ) && $model->contact ( Yii::$app->params ['adminEmail'] )) {
            Yii::$app->session->setFlash ( 'contactFormSubmitted' );
            
            return $this->refresh ();
        }
        return $this->render ( 'contact', [ 
                'model' => $model 
        ] );
    }
    
    /**
     * Displays about page.
     *
     * @return string
     */
    public function actionAbout() {
        return $this->render ( 'about' );
    }
}
