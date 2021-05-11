<?php 

if ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == 'srv.shipme.yii')
	return [
	    'class' => 'yii\db\Connection',
	    'dsn' => 'mysql:host=localhost;dbname=yii2angular',
	    'username' => 'root',
	    'password' => '',
	    'charset' => 'utf8',
	];
	
	return [
			'class' => 'yii\db\Connection',
			'dsn' => 'mysql:host=127.0.0.1:3306;dbname=dsyamwzhjz',
			'username' => 'dsyamwzhjz',
			'password' => 'QF6WwVByGf',
			'charset' => 'utf8',
	];
