import {Injectable} from '@angular/core';
import { Http, URLSearchParams } from '@angular/http'
import { CompanyProfileModel } from './company-profile.model';
import { Helpers } from '../../tools/helpers';
import { EmployeesModel } from '../../employees/employees.model';


@Injectable() 
export class ProfileService {
    private url = Helpers.getBackendUrl()+"company-profile"; 
    constructor (private http: Http){}
    
    get(id:number=0) {               
        return this.http.get(this.url+'/'+id, Helpers.getRequestHeaders()).map(res => res.json() as CompanyProfileModel);
    }

    employeesList(id:number=0) {               
        return this.http.get(this.url+'/employees?id='+id, Helpers.getRequestHeaders()).map(res => res.json() as EmployeesModel[]);
    }

    save(profile:CompanyProfileModel) {
        if (profile.id)
           return this.http.put(this.url+'/'+profile.id, JSON.stringify(profile), 
                Helpers.getRequestHeaders()).map(res => res.json() as CompanyProfileModel); 
           return this.http.post(this.url, JSON.stringify(profile), 
                Helpers.getRequestHeaders()).map(res => res.json() as CompanyProfileModel);  
    }
}