import { Injectable } from '@angular/core';
import { Helpers } from '../../tools/helpers';
import { Http } from '@angular/http';

@Injectable()
export class DashboardTrusteeSearchService {
    private url = Helpers.getBackendUrl()+"misc/search";

    constructor (private http: Http){
    }

    search(text:string) {
      return this.http.post(this.url, JSON.stringify({text:text}), Helpers.getRequestHeaders()).map(res => res.json() as any);  
    }
}
