import { Injectable } from '@angular/core';
import { OrderComplaintModel } from './order-complaint.model';
import { Http } from '@angular/http';
import { Helpers } from '../../tools/helpers';
import 'rxjs/add/operator/map';

@Injectable()
export class OrderComplaintService {


  private url = Helpers.getBackendUrl()+"complaint"; 
  constructor (private http: Http){
  }

  post(model:OrderComplaintModel) {
      if (model.isNewModel)
        return this.http.post(this.url, JSON.stringify(model), Helpers.getRequestHeaders()).map(res => res.json() as any);  
      else
        return this.http.put(this.url+'/'+model.order_id, JSON.stringify(model), Helpers.getRequestHeaders()).map(res => res.json() as any);        
  }
  get(order_id:number){
      return this.http.get(this.url + '/'+order_id, Helpers.getRequestHeaders()).map(res => res.json() as OrderComplaintModel);
  }
}
