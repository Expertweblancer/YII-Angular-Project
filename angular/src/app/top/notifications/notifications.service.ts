import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Helpers } from '../../tools/helpers';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NotificationsModel } from './notifications.model';

@Injectable()
export class NotificationsService {
  private url = Helpers.getBackendUrl()+"notifications"; 
  constructor (private http: Http){}
  
  public handleError(err:Response){
      console.log(err);
      
  }
  delete(id:number){
    let url = this.url+ '/'+id;
    return this.http.delete(url,Helpers.getRequestHeaders()).map(res => res.json() as any);
  }
  getNumUnread(){
    let url = this.url+ '/get-num-of-unread';
    return this.http.get(url,Helpers.getRequestHeaders()).map(res => res.json() as any);
  }
  list(){
    let url = this.url;
    return this.http.get(url,Helpers.getRequestHeaders()).map(res => res.json() as NotificationsModel[]);    
  }
}
