import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helpers } from '../tools/helpers';

@Injectable()
export class EmployeesService {
   private url = Helpers.getBackendUrl()+"fleet"; 
    constructor (private http: Http){
    }

    post() {
            return this.http.post(this.url+'/edit-fleet',  Helpers.getRequestHeaders()).map(res => res.json() as any);  
    }
    get(){
    }


}
