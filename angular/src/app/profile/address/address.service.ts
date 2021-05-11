import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AddressModel } from './address.model';
import { Helpers } from '../../tools/helpers';


@Injectable()
export class AddressService {

    private url = Helpers.getBackendUrl()+"address"; 
    constructor (private http: Http){}

    save(a:AddressModel) {
      if (a.id)
        return this.http.put(this.url+'/'+a.id, JSON.stringify(a), Helpers.getRequestHeaders()).map(res => res.json() as AddressModel);
      else
        return this.http.post(this.url, JSON.stringify(a), Helpers.getRequestHeaders()).map(res => res.json() as AddressModel);
    }

    get(id:number) {
        let url = this.url+'/'+id;
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as AddressModel);
    }
}
