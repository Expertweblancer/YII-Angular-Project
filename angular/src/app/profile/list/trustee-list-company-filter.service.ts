import {Injectable} from '@angular/core';
import { Http, URLSearchParams } from '@angular/http'
import { Helpers } from '../../tools/helpers';
import { TrusteeListCompanyFilterModel } from './trustee-list-company-filter.model';
import { CompanyProfileModel } from '../company/company-profile.model';


@Injectable() 
export class TrusteeListCompanyFilterService {
    private url = Helpers.getBackendUrl()+"company-profile"; 
    constructor (private http: Http){
    }

    filter(f:TrusteeListCompanyFilterModel) {
        let url = this.url + '/filter'
        console.log('filter' + url);
        
        return this.http.post(url, JSON.stringify(f), 
            Helpers.getRequestHeaders()).map(res => res.json() as CompanyProfileModel[]);  
    }
}