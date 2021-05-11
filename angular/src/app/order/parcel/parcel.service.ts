import {Injectable} from '@angular/core';
import { ParcelModel } from './parcel.model';
import {Http, URLSearchParams} from '@angular/http'
import 'rxjs/add/operator/map';
import { Helpers } from '../../tools/helpers';



@Injectable()
export class ParcelService {
    private url = Helpers.getBackendUrl()+"parcel"; 
    constructor (private http: Http){ }

    getParcels(order_id:number) {
        let url = this.url + '/'+order_id;
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as ParcelModel[]);
    }
    deleteAll(id:number){
        let url = this.url+"/del?id="+id;
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as ParcelModel);
    }

    create (parcel:ParcelModel, auth_key = null){
        return this.http.post(this.url, JSON.stringify(parcel), Helpers.getRequestHeaders(true, auth_key)).map(res => res.json());
    }

    createMultiple(parcels:ParcelModel[], oid:number, auth_key = null){
        let url  = this.url + '/create-multiple?oid='+oid;
        console.log(url);
        console.log(JSON.stringify(parcels));
        console.log('key: ' + auth_key);
        
        
        return this.http.post(url, JSON.stringify(parcels), Helpers.getRequestHeaders(true, auth_key)).map(res => res.json());
    }
    
    

}