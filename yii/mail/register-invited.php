<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
<?= Yii::t('app', 'Hello {0}', [$username]) ?>,
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 10px; line-height: 1.3; font-weight: normal; margin: 0 0 10px; padding: 0;">
<?=Yii::t('app', 'This message was generated automatically by SNARTO platform. In order of any questions or problems please contact us. You can find more information in');?> <a href="https://snarto.com/customer-how-it-works">https://snarto.com/customer-how-it-works</a>.
</p>

<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
    <?= Yii::t('app', 'You have been registered in application Snarto', Yii::$app->name) ?>.<br/>
<?= Yii::t('app', 'Please login using link below', Yii::$app->name) ?>.</p>

<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
   <a href="<?= $returnUrl ?>login"><?= $returnUrl ?>login</a>
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
    <?= Yii::t('app', 'If you cannot click the link, please try pasting the text into your browser') ?>.
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; font-weight: normal; margin: 0 0 10px; padding: 0;">
    <?= Yii::t('app', 'If you did not make this request you can ignore this email') ?>.
</p>
<p style="font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.3; font-weight: normal; margin: 0 0 10px; padding: 0;">
    <?= Yii::t('app', 'Thank you') ?>,<br/>
    <i><?= Yii::t('app',  '{0} Team', [Yii::$app->name]);?></i>
</p>