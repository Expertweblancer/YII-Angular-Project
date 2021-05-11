<?php
$params = require (__DIR__ . '/params.php');

$config = [ 
		'language' => 'pl',
		'id' => 'basic',
		'name'=>'Snarto',
		'basePath' => dirname ( __DIR__ ),
		'bootstrap' => [ 
				'log' 
		],
		'components' => [ 
				'urlManager' => [
						'enablePrettyUrl' => true,
						'enableStrictParsing' => false,
						'showScriptName' => false,
						'rules' => [
								[
										'class' => 'yii\rest\UrlRule',
										'pluralize' => false,
										'controller' => ['address', 'parcel','country', 'search-order', 'order',
												'company-profile', 'customer-profile', 'category', 'restapi', 'fleet',
												'fleet-type', 'misc', 'user-messages', 'notifications',
												'order-time', 'currency', 'order-attachments', 'single-payment',
												'payment-types', 'comment', 'offer', 'change-log',
												'invoices-manual', 'fleet-order-category', 'complaint']
								],
						]
				],
				'user' => [
						'identityClass' => 'app\models\User',
				],
				'request' => [ 
						'parsers' => [ 
								'application/json' => 'yii\web\JsonParser' 
						],
						// !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
						'cookieValidationKey' => 'O6ofV-mgqvrpNPxuCswZIa00p65WVEgI' 
				],
				'cache' => [ 
						'class' => 'yii\caching\FileCache' 
				],
				'errorHandler' => [ 
						'errorAction' => 'site/error' 
				],
				'mailer' => require (__DIR__ . '/mailer.php'),
				'log' => [ 
						'targets' => [ 
								[ 
									'class' => 'yii\log\DbTarget',
									'levels' => [ 
										'error', 'info' 
									] 
								],
								[ 
									'class' => 'yii\log\EmailTarget',
									'levels' => [ 
										'error' 
									],
									'categories' => [ 
										'yii\db\*' 
									],
									'message' => [ 
										'from' => [ 
											'support@snarto.com'
										],
										'to' => [ 
											'jacek.stanusz@gmail.com' 
										],
										'subject' => 'Database errors at shipme' 
									]
								] 
							] 
				],
				'i18n' => [ 
						'translations' => [ 
								'app*' => [ 
										'class' => 'yii\i18n\DbMessageSource' 
								]
								// 'basePath' => '@app/messages',
								// 'sourceLanguage' => 'en-US',
								 
						] 
				],
				'authManager' => [
					'class' => 'yii\rbac\DbManager',
				],
				'db' => require (__DIR__ . '/db.php'),
 
		],
		'params' => $params 
];

if (YII_ENV_DEV) {
	// configuration adjustments for 'dev' environment
	$config ['bootstrap'] [] = 'debug';
	$config ['modules'] ['debug'] = [ 
			'class' => 'yii\debug\Module' 
	]
	// uncomment the following to add your IP if you are not connecting from localhost.
	// 'allowedIPs' => ['127.0.0.1', '::1'],
	;
	
	$config ['bootstrap'] [] = 'gii';
	$config ['modules'] ['gii'] = [ 
			'class' => 'yii\gii\Module' 
	]
	// uncomment the following to add your IP if you are not connecting from localhost.
	// 'allowedIPs' => ['127.0.0.1', '::1'],
	;
}

return $config;
