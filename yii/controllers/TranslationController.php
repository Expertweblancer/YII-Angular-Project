<?php

namespace app\controllers;

use app\components\BaseRestController;
use yii\filters\VerbFilter;
use app\components\CustomCors;
use app\models\SourceMessage;
use app\models\Message;

class TranslationController extends BaseRestController {
    // adjust the model class to match your model
    public $modelClass = 'app\models\Message';
    
    /*
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
        return $behaviors;
    }
    
    /*
     * Translate object
     *
     * @return object Translated object
     */
    public function actionTranslate() {
        if ($post = \Yii::$app->request->post ()) {
            $lang = 'pl';
            
            $retVal = [ ];
            $msgs = json_decode ( json_encode ( $post ) );
            foreach ( $msgs as $key => $msg )
                $retVal [$key] = \Yii::t ( 'app', $msg, [ ], $lang );
            return $retVal;
        } else
            return self::RESPONSE_BAD_REQUEST;
    }
    
    /*
     * Get translated messages
     *
     * @return object Controller Behaviors
     */
    public function actionGetMessages($lang = 'pl') {
        return Message::find ()->where ( [ 
                'language' => $lang 
        ] )->select ( 'source_message.*, message.translation, message.language' )->rightJoin ( 'source_message', 'message.id=source_message.id' )->asArray ()->all ();
    }
    
    /*
     * Save Translated Messages
     *
     * @return object Action Status
     */
    public function actionSet() {
        $is_new_model = false;
        
        if ($post = \Yii::$app->request->post ()) {
            $t = json_decode ( json_encode ( $post ) );
            if (! isset ( $t->message ) || ! isset ( $t->translation ) || ! isset ( $t->language ))
                return self::RESPONSE_BAD_REQUEST;
            $category = 'app';
            if (isset ( $t->category ))
                $category = $t->category;
            
            $sm = SourceMessage::findOne ( [ 
                    'message' => $t->message 
            ] );
            if (! $sm) {
                $sm = new SourceMessage ();
                $sm->message = $t->message;
                $sm->category = $category;
                if (! $sm->save ())
                    return self::RESPONSE_BAD_REQUEST;
            }
            
            $m = Message::find ()->where ( [ 
                    'id' => $sm->id,
                    'language' => $t->language 
            ] )->one ();
            if (! $m) {
                $is_new_model = true;
                $m = new Message ();
                $m->language = $t->language;
                $m->id = $sm->id;
            }
            $m->translation = $t->translation;
            if (! $m->save ())
                return self::RESPONSE_BAD_REQUEST;
            
            $msgs = SourceMessage::find ()->select ( 'message, translation' )->innerJoin ( 'message', 'message.id = source_message.id' )->where ( [ 
                    'language' => $t->language 
            ] )->asArray ()->all ();
            
            if ($msgs) {
                $marr = [ ];
                foreach ( $msgs as $ms )
                    $marr [$ms ['message']] = $ms ['translation'];
            }
            
            return self::RESPONSE_OK + [ 
                    'is_new_model' => $is_new_model,
                    'translation' => $t->translation,
                    'message' => $t->message,
                    'language' => $t->language,
                    'category' => $category 
            ];
        }
        return self::RESPONSE_BAD_REQUEST;
    }
    
    /*
     * Delete Translated Message
     *
     * @return object Action Status
     */
    public function actionDeleteTranslation() {
        if ($post = \Yii::$app->request->post ()) {
            $t = json_decode ( json_encode ( $post ) );
            if (! isset ( $t->id ) || ! isset ( $t->language ))
                return self::RESPONSE_BAD_REQUEST;
            Message::deleteAll ( [ 
                    'id' => $t->id,
                    'language' => $t->language 
            ] );
        }
        return self::RESPONSE_OK;
    }
}