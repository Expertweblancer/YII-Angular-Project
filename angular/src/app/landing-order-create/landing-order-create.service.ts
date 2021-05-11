import { Injectable } from '@angular/core';
import { LandingOrderModel } from './landing-order.model';
import { Http } from '@angular/http';
import { Helpers } from '../tools/helpers';
import 'rxjs/add/operator/map';


@Injectable()
export class LandingOrderCreateService {
  url = Helpers.getBackendUrl()+"order"
  constructor(private http:Http) { }
  
  post(model:LandingOrderModel){
    console.log(model);
    
    return this.http.post(this.url+'/create-and-register', JSON.stringify(model)).map(res=>res.json());
  }
}
