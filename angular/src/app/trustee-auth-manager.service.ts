import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Cookie } from './tools/cookie';
import { AppDefinitions } from './definitions';

@Injectable()
export class TrusteeAuthManager implements CanActivate{
    constructor(private router:Router){ }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if (Cookie.getCookie(AppDefinitions.authKeyCookieName))
        {            
            if (Cookie.getCookie(AppDefinitions.isTrusteeCookieName))
                return true;

            if (Cookie.getCookie(AppDefinitions.isAdminCookieName)){
                    this.router.navigate(['/admin']);
                    return false;
            }
            
            if (Cookie.getCookie(AppDefinitions.authCompanyIdCookieName)){
                    this.router.navigate(['/company']);
                    return false;
            }

            this.router.navigate(['/customer']);
            return false;
        }
        this.router.navigate(['/login']);
        return false
    }
}
