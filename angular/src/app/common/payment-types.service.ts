import { Injectable } from '@angular/core';
import { Helpers } from '../tools/helpers';
import { PaymentTypesModel } from './payment-types.model';
import { Http } from '@angular/http';

@Injectable()
export class PaymentTypesService {

   private url = Helpers.getBackendUrl()+"payment-types"; 
    constructor (private http: Http){}

    getList() {
        let lang='pl';
        return this.http.get(this.url+`/list?lang=${lang}`).map(res => res.json() as PaymentTypesModel[]);
    }
    get(id:number){
        let lang = 'pl';
        return this.http.get(this.url+`/one?id=${+id}&lang=${lang}`).map(res => res.json() as PaymentTypesModel);        
    }

}
