import { Component, OnInit } from '@angular/core';
import { SecurityService } from './security.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppChangeService } from '../app-change.service';
import { InviteModel } from '../employees/invite.model';
import { InviteService } from '../employees/invite.service';
import { Helpers } from '../tools/helpers';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'app-register-from-invitation',
  templateUrl: './register-from-invitation.component.html',
  styleUrls: ['security.css']
})
export class RegisterFromInvitationComponent implements OnInit {
  model = new InviteModel;
  working = false;
  emailFormatInvalid = false;
  messages: Messages;
  registrationError = false;
  registerInProgress = false;
  usernameExists = false;
  emailExists = false;
  terms_url = "";

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private invitedService: InviteService,
    private securityService: SecurityService,
    private messagesService: MessagesService,
    private acs: AppChangeService) {
    this.model.token = this.activatedRoute.snapshot.params['token'];
    this.terms_url = Helpers.getBaseUrl() + 'doc/regulamin_pl.pdf';
  }

  ngOnInit() {
    this.acs.emitChange('logout');
    this.working = true;
    this.messagesService.translate(new Messages()).subscribe(data => {
      this.messages = data;
      this.invitedService.getInfo(this.model.token).subscribe(data => {
        this.working = false;
        if (!data.status)
          this.router.navigate(['/register']);
        else
          this.model = data;
      }, err => this.working = false);
    });
  }

  register() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.model.email)) {
      this.emailFormatInvalid = true;
      return;
    }

    if (!this.model.email || !this.model.password || !this.model.username || this.model.email === '' || this.model.password === '' || this.model.username === '')
      return;

    this.registerInProgress = true;
    this.usernameExists = false;
    this.emailExists = false;

    this.securityService.invitedRegister(this.model).subscribe(data => this.registerResult(data), err => {
      this.registrationError = false;
      console.log(err);
    });

  }
  registerResult(data: any) {
    this.registerInProgress = false;
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
      this.router.navigate(['/login', { rci: 1 }]);
  }
}
class Messages {
  registration_error = "Registration did not go well. Token error.";
  email_cant_empty = "Email cannot be empty";
  email_exists = "Email already exist in database";
  email_not_correct = "Email is not correct";
  finish_registration = "Finish registration";
  email = "E-mail";
  username = "Username";
  username_cant_empty = "Username cannot be empty";
  username_exists = "Username already exist in database"
  password_empty = "Password cannot be empty";
  register = "Register";
  already_registered = "Already registered? Log In!";
  by_clicking_you_accept_terms = "By clicking 'Register', you agree to our"
  terms = "terms";
}