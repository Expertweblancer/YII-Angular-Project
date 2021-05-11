import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { FleetTypeModel } from './fleet-type.model';
import { FleetOrderCategoryModel } from './fleet-order-category.model';
import { Helpers } from '../tools/helpers';
import { CategoryModel } from '../category/category.model';

@Injectable()
export class FleetOrderCategoryService {
    private url = Helpers.getBackendUrl()+"fleet-order-category"; 
    constructor (private http: Http){}
    
    set(f:CategoryModel[], fid:number){
        let url = this.url+'?fid='+fid;
        console.log(url);
        console.log(JSON.stringify(f));
        
        
        return this.http.post(url, JSON.stringify(f), Helpers.getRequestHeaders()).map(res => res.json() as any);        
    }

    getCategories(fid:number) {
        let url = this.url+'?fid='+fid;
        return this.http.get(url).map(res => res.json() as any);
    }
}
