import { AppDefinitions } from '../definitions';

export class Cookie{
    static setCookie(name:string, value:string,days:number = AppDefinitions.authCookieDaysExpire) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    static getCookie(name:string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    
    static setAsName(name){
        this.setCookie(name, name, 1);
    }

    static existsAndDelete(name:string):boolean{
        let retVal = this.getCookie(name)==name;
        if (retVal)
            this.deleteCookie(name);
        return retVal;
    }

    static deleteCookie(name:string) {
        this.setCookie(name,"",-1);
    }

    static clearAllCookies(){
        Cookie.deleteCookie(AppDefinitions.isAdminCookieName);
        Cookie.deleteCookie(AppDefinitions.authKeyCookieName);    
        Cookie.deleteCookie(AppDefinitions.isAdminCookieName);
        Cookie.deleteCookie(AppDefinitions.isTrusteeCookieName);
        Cookie.deleteCookie(AppDefinitions.authUserIdCookieName);
        Cookie.deleteCookie(AppDefinitions.authCompanyIdCookieName);
        Cookie.deleteCookie(AppDefinitions.hasCustomerProfile);
        Cookie.deleteCookie(AppDefinitions.noProfileButOrders);
    }
}