import { Injectable } from '@angular/core';
import { AppDefinitions } from '../definitions';
import { Http, RequestOptions, Headers } from '@angular/http';


@Injectable()
export class GoogleMapsService {
  url = "https://maps.googleapis.com/maps/api/distancematrix/json?"
  constructor(private http:Http) {
    this.url+='key=' + AppDefinitions.googleMapsKey;
  }
  getDistance(fromCity:string, fromCountry:string, toCity:string, toCountry:string){
    let origin = fromCity.replace(/ /g, '+') + ','+fromCountry;
    let destination = toCity.replace(/ /g, '+')+ ','+toCountry;
    let url = this.url+'&origins='+origin+'&destinations='+destination;
    let headers = new Headers();
    headers.append('accept', "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");  
    headers.append("accept-language","pl-PL,pl;q=0.8,en-US;q=0.6,en;q=0.4")
    let headersOptions = new RequestOptions({headers: headers});
    return this.http.get(url, headersOptions);
  }
}
