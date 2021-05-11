import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Helpers } from '../tools/helpers';

@Injectable()
export class MessagesService {
    url = Helpers.getBackendUrl()+"translation/translate"
    private headers = new Headers({'Content-Type': 'application/json'});
    
    constructor(private http: Http){}
    
    public translate(model:any){
        return this.http.post(this.url, JSON.stringify(model),  {headers: this.headers}).map(res => res.json() as any);
    }  
}
