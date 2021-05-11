import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Cookie } from './tools/cookie';
import { AppDefinitions } from './definitions';

@Injectable()
export class CustomerAuthManager implements CanActivate{
    constructor(private router:Router){ }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if (Cookie.getCookie(AppDefinitions.authKeyCookieName))
        {            
            if (Cookie.getCookie(AppDefinitions.isAdminCookieName)){
                    this.router.navigate(['/admin']);
                    return false;
            }
            
            if (Cookie.getCookie(AppDefinitions.isTrusteeCookieName)){
                    this.router.navigate(['/trustee']);
                    return false;
            }
            if (Cookie.getCookie(AppDefinitions.authCompanyIdCookieName)){
                    this.router.navigate(['/company']);
                    return false;
            }
            if (!Cookie.getCookie(AppDefinitions.hasCustomerProfile)){
                this.router.navigate(['/profile']);
                return false;
            }
            return true;
        }
        this.router.navigate(['/login']);
        return false    
    }
}