import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { OrderTimeModel } from './order-time.model';
import { Helpers } from '../../tools/helpers';
import 'rxjs/add/operator/map';


@Injectable()
export class OrderTimeService {

  url = Helpers.getBackendUrl()+"order-time";
  constructor(private http:Http) { }
  
  get(order_id:number){
    return this.http.get(this.url+'/get?id='+order_id, Helpers.getRequestHeaders()).map(res => res.json() as OrderTimeModel);
  }
  
  del(id_order:number)
  {
    return this.http.get(this.url+'/del?id='+id_order, Helpers.getRequestHeaders()).map(res => res.json() as any);
  }

  set(orderTimeModel:OrderTimeModel, auth_key:string = null){
    let url = this.url;
    console.log(orderTimeModel);
    
    if (orderTimeModel.id && orderTimeModel.id>0)
      return this.http.put(url + '/'+orderTimeModel.id, JSON.stringify(orderTimeModel), Helpers.getRequestHeaders()).map(res => res.json() as OrderTimeModel[]);      
    else
      return this.http.post(url, JSON.stringify(orderTimeModel), Helpers.getRequestHeaders(true, auth_key)).map(res => res.json() as OrderTimeModel[]);      
  }
}
