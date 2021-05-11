import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { Cookie } from '../../tools/cookie';
import { UserModel } from './user.model';
import { Helpers } from '../../tools/helpers';


@Injectable()
export class AdminUserService {

    private url = Helpers.getBackendUrl()+"admin"; 
    constructor (private http: Http){}

    getUserList() {  
        var url = this.url+'/get-user-list'
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as UserModel[]);
    }
}
