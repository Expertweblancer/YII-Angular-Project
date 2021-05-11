import { Injectable } from '@angular/core';
import { Helpers } from '../tools/helpers';

import { Http } from '@angular/http';
import { CurrencyModel } from './currency.model';

@Injectable()
export class CurrencyService {
    
    private url = Helpers.getBackendUrl()+"currency"; 
    constructor (private http: Http){}

    getList() {
        return this.http.get(this.url).map(res => res.json() as CurrencyModel[]);
    }
    getCurrency(id:number) {
        return this.http.get(this.url+'/'+id).map(res => res.json() as CurrencyModel);
    }


}
