import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Helpers } from '../../tools/helpers';
import { UserMessageModel } from './user-message.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Injectable()
export class UserMessageService {
    private url = Helpers.getBackendUrl()+"user-messages"; 
    constructor (private http: Http){}
    
    public handleError(err:Response){
        console.log(err);        
    }

    getMessagesByOrderId(order_id:number, token:string, uid:number, is_company:boolean){
        let ico:number = +is_company;
        let url = this.url+"/get-by-order-id?oid="+order_id+'&token='+token+'&uid='+uid+'&ico='+ico;

        return this.http.get(url,Helpers.getRequestHeaders())
            .map(res => res.json() as UserMessageModel[]).catch((e) => {
                return TimerObservable.throw(console.log(`${ e.status } ${ e.statusText }`))
            }
    );          
}
    delete(token:string, message_id:number, is_company:boolean){
        let ico:number = +is_company;
        let url = this.url+'/mark-as-deleted?token='+token+'&ico='+ico+'&mid='+message_id;        
        
        return this.http.get(url,Helpers.getRequestHeaders()).map(res => res.json() as any);    
    }
    
    getList(is_company:boolean){
        let ico:number = +is_company;        
        let url = this.url+"/get-list?ico="+ico;
        return this.http.get(url,Helpers.getRequestHeaders()).map(res => res.json() as UserMessageModel[]);  
    }

    getNumUnread(is_company:boolean){
        let ico:number = +is_company;
        let url = this.url+"/get-num-of-unread?ico="+ico;
        
        return this.http.get(url, 
                Helpers.getRequestHeaders()).map(res => res.json() as any);          
    }
    
    markAsRead(mid:number){
        let url = this.url+"/mark-as-read?mid="+mid;
        return this.http.get(url, 
                Helpers.getRequestHeaders()).map(res => res.json() as any);        
    }

    sendMessage(messageModel:UserMessageModel){
        let url = this.url+"/send";
        return this.http.post(url, JSON.stringify(messageModel), 
                Helpers.getRequestHeaders()).map(res => res.json() as UserMessageModel);  
    }
            
  }
