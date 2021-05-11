import 'rxjs/add/operator/map';
import { AppDefinitions } from '../definitions';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Cookie } from '../tools/cookie';
import { Helpers } from '../tools/helpers';
import { UserInfoModel } from './user-info.model';
import { ProfileUserModel } from '../profile/user/profile-user.model';

@Injectable()
export class SecurityService {
    url = Helpers.getBackendUrl()+"security"
   
    constructor(private http: Http){}

    login(username:String, pass:String){
        console.log(this.url);
        return this.http.post(this.url+'/login', JSON.stringify({username:username, password:pass}), 
           Helpers.getRequestHeaders(false)).map(res => res.json() as UserInfoModel);
    }

    setProfile(uid:number, pid:number){
        return this.http.get(this.url+'/set-profile?uid='+uid+'&pid='+pid, 
           Helpers.getRequestHeaders()).map(res => res.json() as any);                
    }

    updatePassword(p:string)
    {
        return this.http.post(this.url+'/save-password', JSON.stringify({password:p}), 
           Helpers.getRequestHeaders()).map(res => res.json() as ProfileUserModel);        
    }

    logout(){
        var url = this.url+'/logout?t='+Cookie.getCookie(AppDefinitions.authKeyCookieName);
        return this.http.get(url, Helpers.getRequestHeaders(false)).map(res => res.json() as any);                

    }

    resetPassword(email:string){
       var url = this.url+'/reset-password-request';
       return this.http.post(url, JSON.stringify({email:email,  return_url:Helpers.getBaseUrl().concat("reset-password-form")}), 
                Helpers.getRequestHeaders(false)).map(res => res.json() as any);                
    }

    changePassword(password:string, newPassword:string){
        var url = this.url+'/change-password'; 
        return this.http.post(url, JSON.stringify({ new_password:newPassword, password:password, return_url:Helpers.getBaseUrl()}), 
           Helpers.getRequestHeaders()).map(res => res.json() as any);        
    }

    changePasswordReset(newPassword:string, key:string){
        var url = this.url+'/change-password-reset';

        console.log(JSON.stringify({key:key, new_password:newPassword, return_url:Helpers.getBaseUrl()}));

        return this.http.post(url, JSON.stringify({key:key, new_password:newPassword, return_url:Helpers.getBaseUrl()}), 
                Helpers.getRequestHeaders()).map(res => res.json() as any);        
    }

    trusteeRegister(profile:any){
        profile.return_url = Helpers.getBaseUrl()
        var url = this.url+'/trustee-register';
        return this.http.post(url, JSON.stringify(profile), 
                Helpers.getRequestHeaders()).map(res => res.json() as any);        
    }


    register(email:string, username:string, pass:string){
       var url = this.url+'/register';
       return this.http.post(url, JSON.stringify({username:username, password:pass, email:email, return_url:Helpers.getBaseUrl()}), 
                Helpers.getRequestHeaders(false)).map(res => res.json() as any);        
    }

    resend(email:string){
       var url = this.url+'/resend';
       return this.http.post(url, JSON.stringify({email:email, return_url:Helpers.getBaseUrl()}), 
                Helpers.getRequestHeaders()).map(res => res.json() as any);        
    }
    
    isLoggedIn(){
       let url= this.url+'/is-logged-in';
       
       return this.http.post(url, JSON.stringify({key:Cookie.getCookie(AppDefinitions.authKeyCookieName)}), 
                Helpers.getRequestHeaders()).map(res => res.json() as any);     
    }

    getUserInfo(){
       let url= this.url+'/get-user-info';
       return this.http.get(url, Helpers.getRequestHeaders()).map(res => res.json() as UserInfoModel);     
    }
    
    getProfileUser(){
       var url = this.url+'/get-profile-user';
       return this.http.get(url,  
                Helpers.getRequestHeaders(true)).map(res => res.json() as any);                        
    }

    confirmEmail(key) {
       var url = this.url+'/confirm-email';
       return this.http.post(url, JSON.stringify({key:key}), 
                Helpers.getRequestHeaders(false)).map(res => res.json() as any);                
    }

    invitedRegister(data:any){
        data.return_url = Helpers.getBaseUrl()
        return this.http.post(this.url+'/register-invited', JSON.stringify(data), Helpers.getRequestHeaders(false)).map(res => res.json() as any);
    }

    checkEmail(email:string){
        return this.http.post(this.url + '/check-email-exists', JSON.stringify({email: email}), Helpers.getRequestHeaders(false)).map(res => res.json() as any);        
    }

    checkUsername(username:string){
        return this.http.post(this.url + '/check-username-exists', JSON.stringify({username: username}), Helpers.getRequestHeaders(false)).map(res => res.json() as any);
    }
}