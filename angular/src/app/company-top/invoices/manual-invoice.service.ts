import { Injectable } from '@angular/core';
import { Helpers } from '../../tools/helpers';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ManualInvoiceModel } from './manual-invoice.model';

@Injectable()
export class ManualInvoiceService {
    private url = Helpers.getBackendUrl()+"invoices-manual"; 
    constructor (private http: Http){}

    getForCustomer(){
        return this.http.get(this.url, Helpers.getRequestHeaders()).map(res => res.json() as any);                
    }
    
    getForCompany(){
        return this.http.get(this.url, Helpers.getRequestHeaders()).map(res => res.json() as any);                
    }

    set(m: ManualInvoiceModel){
        return this.http.post(this.url, JSON.stringify(m), Helpers.getRequestHeaders()).map(res => res.json() as any);                        
    }

    getCompleated(fromCompany:boolean){
        let url:string;
        if (fromCompany)
            url = this.url+"/list?fromCompany=1";
        else
            url = this.url+"/list";
        return this.http.get(url,Helpers.getRequestHeaders()).map(res => res.json() as any[]);        
    }

    delete(m:ManualInvoiceModel){
        return this.http.delete(this.url+'/'+m.order_id, Helpers.getRequestHeaders()).map(res => res.json() as any);                
    }
}
