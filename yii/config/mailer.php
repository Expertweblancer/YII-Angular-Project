<?php
if ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == 'srv.shipme.yii')
	return [
			'class' => 'yii\swiftmailer\Mailer',
			'useFileTransport' => true,
	];
return [
		'class' => 'yii\swiftmailer\Mailer',
		'useFileTransport' => false,
		'transport' => [
	        'class'      => 'Swift_SmtpTransport',
	        'host'       => 'smtp.gmail.com',
	        'username'   => 'support@snarto.com',
	        'password'   => 'gbdg9v7upXpt!@#',
	        'port'       => '465',
	        'encryption' => 'ssl',
	    ]
	];
?>