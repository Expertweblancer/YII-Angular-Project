<?php

use app\helpers\Helpers;

/* @var $this yii\web\View */
echo time();
echo '<br>';
echo Helpers::uniqueId(time()).Helpers::uniqueId();
?>