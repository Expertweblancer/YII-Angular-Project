<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
<?= Yii::t('app', 'Hello {0}', [$username]) ?>,
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 10px; line-height: 1.3; font-weight: normal; margin: 0 0 10px; padding: 0;">
<?=Yii::t('app', 'This message was generated automatically by SNARTO platform. In order of any questions or problems please contact us. You can find more information in');?> <a href="https://snarto.com/customer-how-it-works">https://snarto.com/customer-how-it-works</a>.
</p>

<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
    <?= Yii::t('app', 'Your order <b>"{0} ({1}, <span>{3}<span> - {2}, {4})"</b> has been just succesfully added to SNARTO', 
    [$order->title, $order->from_city, $order->to_city, strtoupper($order->from_country_short), strtoupper($order->to_country_short)]) ?>.
</p>
<p>
    <?= Yii::t('app', 'Click following link to see your order')?> 
    <a href="<?= Yii::$app->params['frontendUrl'] ?>/customer/order/<?= $order->id?>"><?=Yii::$app->params['frontendUrl'] ?>/customer/order/<?= $order->id?></a>
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 10px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
    <?= Yii::t('app', 'If you cannot click the link, please try pasting the text into your browser') ?>.
</p>

<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.3; font-weight: normal; margin: 0 0 10px; padding: 0;">
    <?= Yii::t('app', 'Thank you') ?>,<br/>
    <i><?= Yii::t('app',  '{0} Team', [Yii::$app->name]);?></i>
</p>