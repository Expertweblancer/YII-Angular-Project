import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Cookie } from '../tools/cookie';
import { CategoryModel } from './category.model';
import { Helpers } from '../tools/helpers';

@Injectable()
export class CategoryService {
    private url = Helpers.getBackendUrl()+"category"; 
    private r :string;
    private headers :Headers;
    private headersOptions:RequestOptions;
    constructor (private http: Http){
        this.headers = new Headers();
        this.headers.append('Content-Type','application/x-www-form-urlencoded');  
        this.headersOptions = new RequestOptions({headers: this.headers});
    }

  getCategories(){
    return this.http.get(this.url+'/list?lang=pl', Helpers.getRequestHeaders()).map(res => res.json() as CategoryModel[]);
  }
  getCategory(id:number){
     return this.http.get(this.url+'/view-category?lang=pl&id='+id, this.headersOptions).map(res => res.json() as any);
  }
}
