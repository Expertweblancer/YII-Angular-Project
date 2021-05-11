<?php
namespace app\controllers;

use app\components\CustomCors;
use app\models\FleetOrderCategories;
use yii\filters\VerbFilter;
use app\components\BaseRestController;
use yii\web\BadRequestHttpException;

class FleetOrderCategoryController extends BaseRestController
{
    // adjust the model class to match your model
    public $modelClass = 'app\models\Category';
    
    /**
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
    	
    	
    	// avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
    	$behaviors['authenticator']=$auth;
    	$behaviors['verbs'] = [
    			'class' => VerbFilter::className(),
    	];
    	return $behaviors;  
    }
    
    /**
     * Unset unnecessary REST actions
     *
     * @return actions array
     */
    public function actions(){
    	$a = parent::actions();
    	unset($a['index']);
    	unset($a['update']);
    	unset($a['create']);
    	
    	return $a;
    }
    
    /**
     * Get translated fleet categories
     * 
     * @param integer $fid Fleet ID
     * @param string $lang Language code
     * 
     * @return object[] Categories
     */
    public function actionIndex($fid, $lang = 'pl')
    {
    	$retVal=[];
    	$cats = FleetOrderCategories::find()->select('category.id, category.text')->where(['id_fleet'=>$fid])->innerJoin('category', 'category.id=id_category')->asArray()->all();
    	for ($i=0; $i<count($cats); $i++ ){
    		$cats[$i]['text']=\Yii::t('app', $cats[$i]['text']);
    	}
		return $cats;
    }
    
    /**
     * Assign fleet category to fleet
     *
     * @param integer $fid Fleet ID
     * @param string $lang Language code
     *
     * @return object[] Categories
     */
    public function actionCreate($fid)
    {
    	
    	if ($post = \Yii::$app->request->post())
    	{
    		$data= json_decode(json_encode($post));
    		//first delete all categories
    		FleetOrderCategories::deleteAll(['id_fleet'=>$fid]);
    	    
    		//assign new categories
    		foreach ($data as $cat){
    			$foc = new FleetOrderCategories();
    			$foc->id_category = $cat->id;
    			$foc->id_fleet = $fid;
    			$foc->save();
    		}
    		return self::RESPONSE_OK;
    	}
    	throw new BadRequestHttpException();
    }
    
}