import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helpers } from '../../tools/helpers';
import { OrderAttachmentsModel } from '../other/order-attachments.model';
import 'rxjs/add/operator/map';

@Injectable()
export class OrderAttachmentsService {
    private url = Helpers.getBackendUrl()+"order-attachments"; 

    constructor (private http: Http){ }

    add(oa:OrderAttachmentsModel[]) {
        return this.http.post(this.url, JSON.stringify(oa), Helpers.getRequestHeaders()).map(res => res.json() as any);
    }
    deleteAll(id:number){
        let url = this.url + 'deleteAll?oid=' + id;
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as OrderAttachmentsModel[]);        
    }
    getAttachments(order_id) {
        let url = this.url + '/' + order_id;
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as OrderAttachmentsModel[]);
    }

}
