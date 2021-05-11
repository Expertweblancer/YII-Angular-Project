import { Cookie } from '../tools/cookie';
import { AppDefinitions } from '../definitions';
export class SystemMode{
    is_trustee = false;
    is_company = false;
    is_customer = false;
    role = "";
    constructor(){
      switch (Cookie.getCookie(AppDefinitions.appModCookieName)){
          case AppDefinitions.companyModVal: this.is_company = true; break;
          case AppDefinitions.trusteeModVal: this.is_trustee = true; break;
          case AppDefinitions.customerModVal: this.is_customer = true; break;
        }
    }
}