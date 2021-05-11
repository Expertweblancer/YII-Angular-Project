import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Cookie } from '../tools/cookie';
import { Helpers } from '../tools/helpers';
import { SearchOrderModel } from './search-order.model';


@Injectable() 
export class SearchOrderService {
    private url = Helpers.getBackendUrl()+"restapi/search-order/search"; 
    constructor (private http: Http){
    }

    getOrderAround (total_km, distance, from_lat, from_lng, to_lat, to_lng, from_address, to_address) {  
        //total_km, this.distance, this.fromAddress.lat, this.fromAddress.lng, this.toAddress.lat, this.toAddress.lng, this.fromAddress.address, this.toAddress.address
        return this.http.post(this.url, JSON.stringify({total_km:total_km, distance:distance, from_lat:from_lat, from_lng:from_lng, to_lat:to_lat, to_lng:to_lng}), 
            Helpers.getRequestHeaders()).map(res => res.json() as any);
    }
}