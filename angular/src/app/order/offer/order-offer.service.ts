import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { OrderOfferModel } from './order-offer.model';
import { Helpers } from '../../tools/helpers';
import 'rxjs/add/operator/map';

@Injectable()
export class OrderOfferService {

    private url = Helpers.getBackendUrl()+"offer"; 
    constructor (private http: Http){
    }

    post(model:OrderOfferModel) {
        console.log(JSON.stringify(model));
        return this.http.post(this.url+'/update-offer', JSON.stringify(model), Helpers.getRequestHeaders()).map(res => res.json() as any);  
    }
    get(order_id:number){
        return this.http.get(this.url+'/get-offers?oid='+order_id, Helpers.getRequestHeaders()).map(res => res.json() as OrderOfferModel[]);
    }

    getWonOffer(order_id:number){
        return this.http.get(this.url+'/get-won-offer?oid='+order_id, Helpers.getRequestHeaders()).map(res => res.json() as OrderOfferModel);        
    }

    choose(oid:number, uid:number){
        return this.http.get(this.url+'/choose-offer?oid='+oid + '&uid='+uid, Helpers.getRequestHeaders()).map(res => res.json() as any);
    }
}
