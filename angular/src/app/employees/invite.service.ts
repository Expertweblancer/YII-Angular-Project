import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Cookie } from '../tools/cookie';
import { Helpers } from '../tools/helpers';
import 'rxjs/add/operator/map';
@Injectable()
export class InviteService {
  url = Helpers.getBackendUrl()+"users-invite"

  constructor(private http:Http) {}
  
  getInvitedList(){
     var url = this.url+'/get-invited-user-list';
     return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as any);            
  }

  invite(model:any){
     var url = this.url+'/invite-email';
     model.return_url = Helpers.getBaseUrl();
     return this.http.post(url, JSON.stringify(model), Helpers.getRequestHeaders()).map(res => res.json() as any);        
  }
  getInfo(token:string){
     var url = this.url+'/get-info?t='+token;  
     return this.http.get(url, Helpers.getRequestHeaders(false)).map(res => res.json() as any);            
  }
}
