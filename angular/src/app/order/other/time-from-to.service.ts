import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { TimeFromToModel } from './time-from-to.model';
import { Helpers } from '../../tools/helpers';
import 'rxjs/add/operator/map';
@Injectable()
export class TimeFromToService {
  url = Helpers.getBackendUrl()+"time-from-to-order/";
  constructor(private http:Http) { }
  getList(order_id:number){
    let url = this.url+'index?id='+order_id;
    return this.http.get(url, Helpers.getRequestHeaders(false)).map(res => res.json() as TimeFromToModel[]);  
  }
  set(timeFromToModel:TimeFromToModel[]){
    let url = this.url+'set';
    return this.http.post(url, JSON.stringify(timeFromToModel), Helpers.getRequestHeaders()).map(res => res.json() as TimeFromToModel[]);      
  }
}
