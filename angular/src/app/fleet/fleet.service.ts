import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Cookie } from '../tools/cookie';
import { FleetModel } from './fleet.model';
import { Helpers } from '../tools/helpers';
import { FleetFilterModel } from './fleet-filter.model';

@Injectable()
export class FleetService {
    private url = Helpers.getBackendUrl()+"fleet"; 
    constructor (private http: Http){
    }

    post(model:FleetModel) {
        console.log(JSON.stringify(model));
        if (model.id)
            return this.http.put(this.url+'/'+model.id, JSON.stringify(model), Helpers.getRequestHeaders()).map(res => res.json() as any);  
        else
            return this.http.post(this.url, JSON.stringify(model), Helpers.getRequestHeaders()).map(res => res.json() as any);  
    }
    get(id:number = 0)
    {
        if (id)
            return this.http.get(this.url+'/'+id, Helpers.getRequestHeaders()).map(res => res.json() as any);
        return this.http.get(this.url, Helpers.getRequestHeaders()).map(res => res.json() as any);                
    }

    filter(f:FleetFilterModel){        
        return this.http.post(this.url+'/filter', JSON.stringify(f), Helpers.getRequestHeaders()).map(res => res.json() as FleetModel[]);  
    }
    
    delete(id:number){
        return this.http.get(this.url+'/delete-fleet?id='+id, Helpers.getRequestHeaders()).map(res => res.json() as any);
    }

    getHistory(fid:number){
        console.log(this.url+'/get-history?fid='+fid);
        
        return this.http.get(this.url+'/get-history?fid='+fid, Helpers.getRequestHeaders()).map(res => res.json() as any);        
    }
}
