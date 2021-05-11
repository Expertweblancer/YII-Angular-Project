import { Cookie } from './cookie';
import { AppDefinitions } from '../definitions';
import { UserInfoModel } from '../security/user-info.model';

export class Security{
    
    public static  setUserInfoCookies(userInfo: UserInfoModel){
      console.log('user info cookie');
      console.log(userInfo);
      Cookie.clearAllCookies();

      if (userInfo.is_admin)
        Cookie.setCookie(AppDefinitions.isAdminCookieName, userInfo.is_admin.toString());
      if (userInfo.auth_key)
        Cookie.setCookie(AppDefinitions.authKeyCookieName, userInfo.auth_key.toString());    
      if (userInfo.is_admin)
        Cookie.setCookie(AppDefinitions.isAdminCookieName, userInfo.is_admin.toString());
      if (userInfo.is_trustee)
        Cookie.setCookie(AppDefinitions.isTrusteeCookieName, userInfo.is_trustee.toString());
      if (userInfo.uid)
        Cookie.setCookie(AppDefinitions.authUserIdCookieName, userInfo.uid.toString());
      if (userInfo.company_profile_id)
        Cookie.setCookie(AppDefinitions.authCompanyIdCookieName, userInfo.company_profile_id.toString());
      if (userInfo.no_profile_but_orders)
        Cookie.setCookie(AppDefinitions.noProfileButOrders, 'true');
      if (userInfo.has_customer_profile)
        Cookie.setCookie(AppDefinitions.hasCustomerProfile, 'true');
    }
}