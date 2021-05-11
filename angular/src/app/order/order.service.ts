import {Injectable} from '@angular/core';
import { OrderModel } from './order.model';
import {Http} from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Cookie } from '../tools/cookie';
import { Helpers } from '../tools/helpers';
import { OrderUserModel } from './other/order-user.model';
import { OrderListFilterModel } from './order-list-filter.model';


@Injectable() 
export class OrderService {
    private url = Helpers.getBackendUrl()+"order"; 

    constructor (private http: Http){ }

    getOrders() {  
        return this.http.get(this.url, Helpers.getRequestHeaders()).map(res => res.json() as any);
    }

    getOrder(id: number, token:string=null) {
        let url = this.url+"/"+id;
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as any);
    }

    set (order:OrderModel, auth_key:string = null){
        console.log(JSON.stringify(order));
        if (order.id && order.id>0)
            return  this.http.patch(this.url + '/'+order.id, JSON.stringify(order), Helpers.getRequestHeaders()).map(res => res.json());
        else
            return  this.http.post(this.url, JSON.stringify(order), Helpers.getRequestHeaders(true, auth_key)).map(res => res.json());

    }
    deleteOrder(id:number){ 
        return this.http.delete(this.url+"/"+id.toString(), Helpers.getRequestHeaders()).map(res => res.json() as OrderUserModel);
    }

    cancelOrder(id:number){
        let url = this.url+"/change-status?status=cancelled&id="+id.toString(); 
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as any);
    }
    getNumOfOrders(){ 
        return this.http.get(this.url+'/get-num-of-orders', Helpers.getRequestHeaders()).map(res => res.json() as any);
    }

    complete(order_id:number){
        return this.http.get(this.url+'/change-status?id='+order_id+'&status=compleated', Helpers.getRequestHeaders()).map(res => res.json() as any);                
    }

    getUserByOrderId(id:number){
        let url = this.url+"/get-user-by-order-id?id="+id; 
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as OrderUserModel);
    }

    getDateModified(id:number){
        let url = this.url+"/get-date-modified?oid=" + id; 
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as any);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    public filterOrder(o: OrderListFilterModel, fromCompany:boolean=false, fromOrderIdIndex=0){
        let url:string;
        if (fromCompany)
            url = this.url+"/filter-orders?fromCompany=1&idgt="+fromOrderIdIndex;
        else
            url = this.url+"/filter-orders";
        return this.http.post(url, JSON.stringify(o), Helpers.getRequestHeaders()).map(res => res.json() as OrderModel[]);        
    }

    public changeOrderActive(id:number, active:number, auth_key = null){
        let url = this.url + '/change-order-active?id='+id+'&active='+active;
        return this.http.get(url, Helpers.getRequestHeaders(true, auth_key)).map(res => res.json() as OrderModel[]);                
    }
}