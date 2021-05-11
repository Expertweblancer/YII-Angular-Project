<?php
namespace app\helpers;


class Helpers{
	public static function mapModel($model, $id, $field=null)
	{
		$retVal = [];

		foreach ($model as $m){
			if ($field)
				$retVal[$m[$id]]=$m[$field];
				else
					array_push($retVal, $m[$id]);
		}
		return $retVal;
	}
	
	public static function getPasswordHash($password){
		$options = [
				'cost' => 11,
				'salt' => mcrypt_create_iv(22, MCRYPT_DEV_URANDOM),
		];
		return  password_hash($password, PASSWORD_DEFAULT, $options);
	}
	
	// Credit: joost at bingopaleis dot com
	// Input: A decimal number as a String.
	// Output: The equivalent hexadecimal number as a String.
	public static function uniqueId($number=null)
	{
		if (!$number)
			$number = rand(100, 10000);
		$hexvalues = array(
				'0', 'L', '2', 'i', 'O', '5', 'H', '7', '8', '9',
				'A','B','h','r','E','d', 'G', '6', 'I', 'J',
				'K', '1', 'M', 'N', '4', 'u', 'o', 'm', 'T', 'U', 
				'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'F', 'e','f', 
				'g', 'C', 'h', '3', 'j', 'k', 'l', 'S', 'n', 'R', 
				'p', 'q', 'D', 's', 't', 'P', 'w', 'x', 'y', 'z');
		$retval= '';
		while($number != '0')
		{
			$retval= $hexvalues[bcmod($number,'60')].$retval;
			$number = bcdiv($number,'60',0);
		}
		return $retval;
	}
	
	public static function getNotificationOrderText($orderArray){
		$fromCountryShort = $orderArray['from_country_short'];
		$toCountryShort = $orderArray['to_country_short'];
		$fromCity = $orderArray['from_city'];
		$toCity = $orderArray['to_city'];
		$orderTitle = $orderArray['title'];
		return "$orderTitle ($fromCity, $fromCountryShort - $toCity, $toCountryShort)";
	}
	
	public static function getIdsStr($model, $id)
	{
		
		$retVal = '';
		$size = count($model)-1;
		foreach ($model as $i=>$m){
			$retVal.= $m[$id];
			if ($i!=$size)
				$retVal.= ', ';
		}
		return $retVal;
	}
	public static function checkDistance($flat, $flong, $tlat, $tlong, $pflat, $pflong, $ptlat, $ptlong){
			return Helpers::getDistance($flat, $flong, $pflat, $pflong) + Helpers::getDistance($pflat, $pflong, $ptlat, $ptlong) + Helpers::getDistance($ptlat, $ptlong, $tlat, $tlong);
	}
	public static function getDistance($lat1, $lon1, $lat2, $lon2) {
		$pi = 0.017453292519943295;    // Math.PI / 180

		$a = 0.5 - cos(($lat2 - $lat1) * $pi)/2 +
		cos($lat1 * $pi) * cos($lat2 * $pi) *
		(1 - cos(($lon2 - $lon1) * $pi))/2;
	
		return 12742 * asin(sqrt($a)); // 2 * R; R = 6371 km
	}
	
}

