import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from "@angular/http";
import { Cookie } from '../tools/cookie';
import { Helpers } from '../tools/helpers';
import { AppDefinitions } from '../definitions';
declare var $: any;

@Injectable()
export class FileUploadService {
  requestUrl: string;
  responseData: any;
  handleError: any;
  url = Helpers.getBackendUrl()+'misc/upload-file?image=0';

  constructor(private router: Router, private http: Http) {}

  upload (postData: any, files: File[]) {
    if (files.length<1)
      return;
    let headers = new Headers();
    headers.append('Authorization','Bearer '+Cookie.getCookie(AppDefinitions.authKeyCookieName));
    let formData:FormData = new FormData();
    formData.append('files', files[0], files[0].name);
    // For multiple files
    // for (let i = 0; i < files.length; i++) {
    //     formData.append(`files[]`, files[i], files[i].name);
    // }

    if(postData !=="" && postData !== undefined && postData !==null){
      for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
              formData.append(property, postData[property]);
          }
      }
    }
    return this.http.post(this.url, formData, {
        headers: headers
      }).map(res => res.json() as any);  
  }
}
