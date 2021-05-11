import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helpers } from '../../tools/helpers';
import { TranslationModel } from './translation.model';
import 'rxjs/add/operator/map';

@Injectable()
export class TranslationService {

    private url = Helpers.getBackendUrl()+"translation"; 
    constructor (private http: Http){}

    getList(lang:string) {
        var url = this.url+'/get-messages?lang='+lang;
        console.log(url)
        return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as TranslationModel[]);
    }
    setTranslation(t: TranslationModel){
        var url = this.url+'/set'; 
        return this.http.post(url, JSON.stringify(t) ,Helpers.getRequestHeaders()).map(res=>res.json() as TranslationModel)
    }
    delete(to_delete:TranslationModel){
        var url = this.url+'/delete-translation'; 
        return this.http.post(url, JSON.stringify(to_delete),
            Helpers.getRequestHeaders()).map(res=>res.json() as any)
    }
}
