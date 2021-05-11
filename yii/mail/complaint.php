<h1 style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;">
    <?= Yii::t('app', 'Complaint', Yii::$app->name) ?>.
</h1>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
	<?=Yii::t('app', 'Order from')?>: <?= $email?>
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
	<?=Yii::t('app', 'Order was realized')?>: <?= $not_realized?Yii::t('app', 'No'):Yii::t('app', 'Yes');?>
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
	<?= $message?>
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
    <a href="<?=Yii::$app->params['frontendUrl']?>/trustee/order/<?=$id?>"><?= Yii::t('app', 'Order') ?></a>
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.3; font-weight: normal; margin: 0 0 10px; padding: 0;">
    <?= Yii::t('app', 'Thank you') ?>,<br/>
    <i><?= Yii::t('app',  '{0} Team', [Yii::$app->name]);?></i>
</p>