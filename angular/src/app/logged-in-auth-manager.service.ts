import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Cookie } from './tools/cookie';
import { AppDefinitions } from './definitions';

@Injectable()
export class LoggedInAuthManager implements CanActivate{
    constructor(private router:Router){ }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if (!Cookie.getCookie(AppDefinitions.authKeyCookieName))
        {
            this.router.navigate(['/login']);
            return false
        }
        return true;
    }
}