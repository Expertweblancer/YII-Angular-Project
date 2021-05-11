import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { Helpers } from '../../tools/helpers';
import { ProfileUserModel } from '../user/profile-user.model';
import { CustomerProfileModel } from './customer-profile.model';

@Injectable()
export class CustomerProfileService {
  private url = Helpers.getBackendUrl()+"customer-profile"; 
  constructor (private http: Http){}

  set(model:CustomerProfileModel){
    console.log(JSON.stringify(model))
    if (model.updateModel)
      return this.http.put(this.url + '/'+model.user_id, JSON.stringify(model), Helpers.getRequestHeaders()).map(res => res.json() as CustomerProfileModel);      
    return this.http.post(this.url, JSON.stringify(model), Helpers.getRequestHeaders()).map(res => res.json() as CustomerProfileModel);      
    
  }
  
  get(user_id:number=0){
    var url = this.url+'/'+user_id;

    console.log(url);
    

    return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as any);  
  }
}
