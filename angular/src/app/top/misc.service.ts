import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Helpers } from '../tools/helpers';
import { InfoBoxModel } from './info-box.model';
import { TopMenuOrderStatusModel } from './top-menu-order-status.model';

@Injectable()
export class MiscService {
  url = Helpers.getBackendUrl()+"misc"
  constructor(private http:Http) { }
  getCustomerInfoBox(){
    return   this.http.get(this.url+'/get-customer-dashboard-info-box', 
              Helpers.getRequestHeaders()).map(res => res.json() as InfoBoxModel);
  }
  getTrusteeInfoBox(){
    return   this.http.get(this.url+'/get-trustee-dashboard-info-box', 
              Helpers.getRequestHeaders()).map(res => res.json() as InfoBoxModel);
  }
  getOrdersStatus(isCompany:boolean){
    return   this.http.get(this.url+'/order-menu-status?fc='+(isCompany==true?1:0), 
      Helpers.getRequestHeaders()).map(res => res.json() as TopMenuOrderStatusModel);    
  }
  getCompanyInfoBox(){
    return   this.http.get(this.url+'/get-company-dashboard-info-box', 
    Helpers.getRequestHeaders()).map(res => res.json() as InfoBoxModel);
  }         
}
