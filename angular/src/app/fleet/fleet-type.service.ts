import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { FleetTypeModel } from './fleet-type.model';
import { Helpers } from '../tools/helpers';
import 'rxjs/add/operator/map';

@Injectable()
export class FleetTypeService {
    private url = Helpers.getBackendUrl()+"fleet-type"; 
    constructor (private http: Http){}

    getFleetTypes() {
        return this.http.get(this.url+'/list?lang=pl').map(res => res.json() as any);
    }
    getFleetType(id:number) {
        let url = this.url+`/view-fleet-type?id=${id}&lang=pl`;
        return this.http.get(url).map(res => res.json() as any);
    }

}
