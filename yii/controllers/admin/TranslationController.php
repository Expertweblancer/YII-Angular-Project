<?php

namespace app\controllers\admin;


use app\models\Message;
use app\models\SourceMessage;
use app\models\newTranslationForm;
use yii\data\ActiveDataProvider;

class TranslationController extends \yii\web\Controller
{
    public function actionAddLanguage()
    {
        return $this->render('add-language');
    }

    public function actionAddTraslation()
    {
    	
        return $this->render('add-traslation');
    }

    public function actionDelete($id,$lang)
    {
        SourceMessage::deleteAll(['id'=>$id]);
        Message::deleteAll(['id'=>$id, 'language'=>$lang]);
        $this->redirect(['/admin/translation/translations', 'lang'=>$lang]);
    }



    public function actionUpdate($id, $lang)
    {
    	
    	$translationForm = new newTranslationForm();
    	$translationForm->lang = $lang;
    	
    	$s = SourceMessage::findOne($id);
    	$m = Message::find()->where(['id'=>$id, 'language'=>$lang])->one();
    	 
    	if ($translationForm->load(\Yii::$app->request->post()))
    	{
    		$m->translation = $translationForm->translation;
    		$m->save(false);
    		$this->redirect(['/admin/translation/translations', 'lang'=>$lang]);
    	} else 
    	{
    		$translationForm->message = $s->message;
    		$translationForm->translation = $m->translation;
    	}
    	 
    	 
    	 
    	return $this->render('_newTranslationForm', ['lang'=>$lang, 'model'=>$translationForm]);
    }   	 
    public function actionLanguages()
    {
        return $this->render('languages');
    }

    public function actionTranslations($lang)
    {
   	
    	$data =new ActiveDataProvider(['query'=>SourceMessage::find()->select('source_message.id, message.language, source_message.message')
    			->innerJoin('message', 'message.id=source_message.id')->asArray()]);
    	
    	
    	$newTranslationModel = new newTranslationForm();
    	 
    	if ($newTranslationModel->load(\Yii::$app->request->post()))
    	{
    		$s = new SourceMessage();
    		$s->message = $newTranslationModel->message;
    		$s->category = 'app';
    		$s->save();
    		$m = new Message();
    		$m->id = $s->id;
    		$m->language = $newTranslationModel->lang;
    		$m->translation = $newTranslationModel->translation;
    		$m->save();
    		$newTranslationModel = new newTranslationForm();
    	}
    	$newTranslationModel->lang = $lang;
    	 
    	
    	
        return $this->render('translations', ['dataProvider'=>$data, 'lang'=>$lang, 'newTranslationModel'=>$newTranslationModel]);
    }

}
