import { Component, OnInit } from '@angular/core';
import { SecurityService } from './security.service';
import { Router } from '@angular/router';
import { AppChangeService } from '../app-change.service';
import { MessagesService } from '../messages/messages.service';
import { Helpers } from '../tools/helpers';


@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./security.css'],
})
export class RegisterComponent implements OnInit {
  messages:Messages;
  emailExists = false;
  usernameExists = false;
  emailFormatInvalid = false;
  registerInProgress = false;
  username = '';
  password = '';
  email = '';
  working=false;
  terms_url:string;
  constructor(private securityService: SecurityService, private router: Router, private acs:AppChangeService, private msgSrv:MessagesService) { }

  ngOnInit() {
    this.terms_url = Helpers.getBaseUrl()+'doc/regulamin_pl.pdf';
    this.working=true;
    this.acs.emitChange(this.acs.events.logout);
    this.msgSrv.translate(new Messages()).subscribe(data=>{
      this.messages = data;
      this.working = false;
    }, err=>console.log(err));
    
  }
  register() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(this.email)){
      this.emailFormatInvalid = true;
      return;
    }
    this.registerInProgress=true;
    this.usernameExists = false;
    this.emailExists=false;
    if (this.email === '' || this.password === '' || this.username === '')
      return;

    this.securityService.register(this.email, this.username, this.password)
      .subscribe(data => this.registerResult(data), err => this.registerError(err));
  }
  registerError(err: any) {
    console.log(err);
  }
  registerResult(data: any) {
    console.log(data);
    this.registerInProgress = false;
    this.emailExists = false;
    this.usernameExists = false;
    this.emailFormatInvalid = false;
    if (data.status == false) {
      if (data.response == 'email and username exists') {
        this.emailExists = true;
        this.usernameExists = true;
      }
      if (data.response == 'email exists')
        this.emailExists = true;
      if (data.response == 'username exists')
        this.usernameExists = true;
    } else
      this.router.navigate(['/login', {rc:1}]);
  }
}

class Messages{
  field_cant_be_empty = "Field cannot be empty";
  email = "Email";
  password = "Password";
  pass_repeat = "Repeat Password";
  user_exists = "Username already exist in database";
  username = "Username";
  email_incorrect = "Email is not correct";
  register = "Register";
  already_registered = "Already registered? Log In!"
  required ="Required";
  by_clicking_you_accept_terms = "By clicking 'Register', you agree to our"
  terms = "Terms";
  exists = "Email already exist in database"
}