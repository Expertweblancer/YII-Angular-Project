import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helpers } from '../tools/helpers';
import { CommentModel } from './comment.model';

@Injectable()
export class CommentsService {
    private url = Helpers.getBackendUrl()+"comment"; 
    private r :string;
    constructor (private http: Http){    }
  
  set(c:CommentModel){
    return this.http.post(this.url, JSON.stringify(c), Helpers.getRequestHeaders()).map(res => res.json() as CommentModel[]);    
  }
  getByOrderId(order_id:number){
    return this.http.get(this.url+'/'+order_id, Helpers.getRequestHeaders()).map(res => res.json() as CommentModel);
  }
  getListByUser(user_id:number){
     
    return this.http.get(this.url+'/list-by-user?uid='+user_id, Helpers.getRequestHeaders()).map(res => res.json() as CommentModel[]);  
  }
  getListByCompanyId(company_id:number){
    
   return this.http.get(this.url+'/list-by-company?cid='+company_id, Helpers.getRequestHeaders()).map(res => res.json() as CommentModel[]);  
 }
 getAverageRating(company_id:number){
   return this.http.get(this.url+'/get-average-rating?cid='+company_id, Helpers.getRequestHeaders()).map(res => res.json() as any);  
 }

}
