import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams, ResponseContentType, Response } from '@angular/http';
import { AppDefinitions } from '../definitions';
import { Helpers } from '../tools/helpers';
import { P24Model } from './p24.model';

@Injectable()
export class P24Service {
  
  headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  options : RequestOptions;
  url = "https://secure.przelewy24.pl/"
  constructor(private http:Http) {
    this.options = new RequestOptions({ headers: this.headers });
   }
   init(model:P24Model){
     let params = new URLSearchParams(Helpers.obj2params(model));
     console.log(params);
     
     return this.http.post(this.url+'trnRegister', Helpers.obj2params(model)).map((res:Response) => res.text());  
     
   }

   verify(p24_merchant_id:string, p24_pos_id:string, p24_session_id:string, p24_amount:string, p24_currency:string, p24_order_id:string, p24_sign:string){
    return this.http.post(this.url+'trnVerify', JSON.stringify({p24_merchant_id:p24_merchant_id, p24_pos_id:p24_pos_id, p24_session_id:p24_session_id, p24_amount:p24_amount, 
        p24_currency:p24_currency, p24_order_id:p24_order_id, p24_sign:p24_sign}));  
   }
}
