import {Injectable} from '@angular/core';
import { Http, URLSearchParams } from '@angular/http'
import { Helpers } from '../../tools/helpers';
import { CustomerProfileModel } from '../customer/customer-profile.model';
import { TrusteeListCustomerFilterModel } from './trustee-list-customer-filter.model';


@Injectable() 
export class TrusteeListCustomerFilterService {
    private url = Helpers.getBackendUrl()+"customer-profile"; 
    constructor (private http: Http){
    }

    filter(f:TrusteeListCustomerFilterModel) {
        let url = this.url + '/filter'
        console.log('filter' + url);
        
        return this.http.post(url, JSON.stringify(f), 
            Helpers.getRequestHeaders()).map(res => res.json() as CustomerProfileModel[]);  
    }
}