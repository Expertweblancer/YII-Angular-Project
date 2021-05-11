<?php 
namespace app\components;

use Yii;
use yii\filters\Cors;

class CustomCors extends  Cors {

    public function beforeAction($action)
    {
        parent::beforeAction($action);

        if (Yii::$app->getRequest()->getMethod() === 'OPTIONS') {
            Yii::$app->getResponse()->getHeaders()->set('Allow', 'POST GET PUT');
            Yii::$app->end();
        }        
        return true;
    }
    public static function getCors(){
		return
		[
				'class' => self::className(),
				'cors' => [
						// restrict access to
						'Origin' => [
								 '*',                        // star allows all domains
						],
						'Access-Control-Request-Method' => ['POST', 'PUT', 'GET', 'PATCH'],
						'Access-Control-Request-Headers' => ['*'],
						// Allow only headers 'X-Wsse'
						'Access-Control-Allow-Credentials' => true,
						// Allow OPTIONS caching
						'Access-Control-Max-Age' => 3600,
				],
		];
    }
}

