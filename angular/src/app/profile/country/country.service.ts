import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams} from '@angular/http'
import { CountryModel } from './country.model';
import { Helpers } from '../../tools/helpers';


@Injectable() 
export class CountryService {
    private url = Helpers.getBackendUrl()+"restapi/country"; 
    constructor (private http: Http){}

    getCountries() {
        let url = this.url+'/get-countries';
        return this.http.get(url).map(res => res.json() as any);
    }
    getCountry(id:number) {
        let url = this.url+'/get-country?id='+id;
        return this.http.get(url).map(res => res.json() as CountryModel);
    }
}