import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Cookie } from './tools/cookie';
import { AppDefinitions } from './definitions';

@Injectable()
export class AdminAuthManager implements CanActivate{
    constructor(private router:Router){ }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        
        if (Cookie.getCookie(AppDefinitions.authKeyCookieName)){
            if (Cookie.getCookie(AppDefinitions.isAdminCookieName) == 'true' ||
                    Cookie.getCookie(AppDefinitions.isAdminCookieName) == '1')
                return true;
            else
                this.router.navigate(['/trustee']);
        }
        else    
            this.router.navigate(['/login']);
        return false;
    }
}