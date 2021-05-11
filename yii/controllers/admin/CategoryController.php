<?php

namespace app\controllers\admin;

use app\models\Category;
use Yii;

class CategoryController extends \yii\web\Controller
{
	public function actionList($id=0)
	{
	
		$result = \app\helpers\Categories::getParent($id);
	
		$model = Category::findAll(['parent_id'=>$id]);
		return $this->render('list', ['model'=>$model, 'parent_id'=>$id, 'categories'=>$result]);
	}
	
	public function actionCreate($id=0)
	{
		$model = new Category();
		$model->parent_id=$id;
	
		if ($model->load ( Yii::$app->request->post () )) {
			if ($model->save())
				Yii::$app->session->setFlash ( 'newcategoryok' );
				else
					Yii::$app->session->setFlash ( 'newcategoryerr' );
					return $this->redirect(['admin/category/list', 'id'=>$id]);
		}
	
		return $this->render('create', ['model'=>$model]);
	}
	
	public function actionSwitchcategorystatus($id){
		$model = Category::findOne($id);
		$retVal = '';
		if ($model->active==1)
		{
			$model->active=0;
			$retVal = '0';
		}
		else
		{
			$model->active=1;
			$retVal = '1';
		}
		$model->save(false);
		die($retVal);
	}
	
	public function actionUpdate($id)
	{
		$model = Category::findOne($id);
	
		if ($model->load ( Yii::$app->request->post () )) {
			if ($model->save())
				Yii::$app->session->setFlash ( 'editcategoryok' );
				else
					Yii::$app->session->setFlash ( 'editcategoryerr' );
					return $this->redirect(['admin/category/list', 'id'=>$id]);
		}
	
		return $this->render('create', ['model'=>$model]);
	}
	

}
