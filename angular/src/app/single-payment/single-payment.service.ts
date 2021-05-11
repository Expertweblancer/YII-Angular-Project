import { Injectable } from '@angular/core';
import { Helpers } from '../tools/helpers';
import { Http } from '@angular/http';
import { SinglePaymentModel } from './single-payment.model';


@Injectable()
export class SinglePaymentService {
  url = Helpers.getBackendUrl()+"single-payment";
  
  constructor(private http:Http) { }
  start(sp:SinglePaymentModel){
    return this.http.post(this.url, JSON.stringify(sp), Helpers.getRequestHeaders()).map(res => res.json() as SinglePaymentModel); 
  }
  get(sid:string){
    return this.http.get(this.url+'/get?id='+sid, Helpers.getRequestHeaders()).map(res => res.json() as SinglePaymentModel);     
  }
}
