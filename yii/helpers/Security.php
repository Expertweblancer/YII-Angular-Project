<?php
namespace app\helpers;

use Yii;
use app\models\User;
use app\models\CustomerProfile;
use app\models\CompanyProfile;
use app\models\Order;

class Security {
	
	public static function getUserInfo($user = null)
	{
		if (Yii::$app->user->isGuest && !$user)
			return[];
		if(!$user)
			$user = User::findOne(Yii::$app->user->id);
		if (!$user)
			return null;
		$isAdmin = $user->getIsAdmin();
		$hasCompanyProfile = $user->getHasCompanyProfile();
		
		$cid = $logo = null;
		
		if ($user->getCompanyProfileId() && ($companyProfile = CompanyProfile::findOne($user->getCompanyProfileId()))){
			$cid = $companyProfile->id;
			$logo = $companyProfile->foto;
		}
		
		$username = $user->username;
		$uid = $user->id;
		
		$authKey = $user->auth_key;
		
		$hasCustomerProfile = false;
		$noProfileButOrders = false;
		$profilePart = [];
		
		if($profile = CustomerProfile::findOne($uid)){
			$profilePart = ['name'=>$profile->name, 'surname'=>$profile->surname, 'foto'=>$profile->foto];
			$hasCustomerProfile=true;
			
		} else {
			if (Order::findOne(['user_id'=>$user->id]))
			$noProfileButOrders = true;
		}
		return ['uid'=>$uid, 
			'is_admin'=>$isAdmin,
			'is_trustee'=>$user->getIsTrustee(),
			'has_customer_profile'=>$hasCustomerProfile,
			'has_company_profile'=>$hasCompanyProfile,
			'company_profile_id'=>$cid,
			'no_profile_but_orders'=>$noProfileButOrders,
			'company_logo'=>$logo,
			'auth_key'=>$authKey,
			'username'=>$username ] 
			+ $profilePart;
	}
}

