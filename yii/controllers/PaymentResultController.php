<?php

namespace app\controllers;

use app\models\SinglePayment;

class PaymentResultController extends \yii\web\Controller
{
    public function actionResult()
    {
    	$p24_merchant_id = isset($_POST['p24_merchant_id'])?$_POST['p24_merchant_id']:null;
    	$p24_pos_id = isset($_POST['p24_pos_id'])?$_POST['p24_pos_id']:null;
    	$p24_session_id =  isset($_POST['p24_session_id'])?$_POST['p24_session_id']:null;
    	$p24_amount = isset($_POST['p24_amount'])?$_POST['p24_amount']:null;
    	$p24_currency = isset($_POST['p24_currency'])?$_POST['p24_currency']:null;
    	$p24_order_id = isset($_POST['p24_order_id'])?$_POST['p24_order_id']:null;
    	$p24_method  = isset($_POST['p24_method'])?$_POST['p24_method']:null;
    	$p24_statement  = isset($_POST['p24_statement'])?$_POST['p24_statement']:null;
    	$p24_sign = isset($_POST['p24_sign'])?$_POST['p24_sign']:null;
    	$p24_session_id = isset($_POST['p24_session_id'])?$_POST['p24_session_id']:null;
    	$p24_amount = isset($_POST['p24_amount'])?$_POST['p24_amount']:null;
    	
    	\Yii::trace('p24 amount'.$p24_amount, 'shipme');
    	\Yii::trace('p24 posid'.$p24_pos_id, 'shipme');
    	\Yii::trace('p24 session id'.$p24_session_id, 'shipme');
    	\Yii::trace('p24 order id'.$p24_order_id, 'shipme');
    	
    	$payment = SinglePayment::findOne(['session_id' => $p24_session_id]);
    	if ($payment)
    	{
    		$payment->paid_amount = $p24_amount;
    		$payment->confirmed = 1;
    		$payment->p24_oid = $p24_order_id;
    		$payment->save(false);
    		\Yii::trace('payment found'.$p24_session_id, 'shipme');
    		return;
    	}
    	\Yii::trace('payment not found'.$p24_session_id, 'shipme');
    }

    public function actionOk()
    {
        return $this->render('ok');
    }

}
