<?php 
if ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == 'srv.shipme.yii')
	return 'http://localhost:4200';
 else
	 if ($_SERVER['SERVER_NAME'] == 'test.snarto.com')
		return 'https://test.snarto.com';	 

return 'https://app.snarto.com';