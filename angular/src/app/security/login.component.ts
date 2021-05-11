import { NgModel, NgControl } from '@angular/forms/src/directives';
import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { SecurityService } from './security.service';
import { User } from './user';
import { Cookie } from '../tools/cookie';
import { AppDefinitions } from '../definitions';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MessageDefinitions } from '../messages/message-definitions';
import { AppChangeService } from '../app-change.service';
import { UserInfoModel } from './user-info.model';
import { Security } from '../tools/security';
import { MessagesService } from '../messages/messages.service';

@Component({
    selector: 'login-form',
    templateUrl: "./login.component.html",
    styleUrls: ['security.css']
})
export class LoginComponent implements OnInit {
    public user: User;
    public serverError = false;
    public loginIncorrect = false;
    public emergencyLogout = false;
    public loginNotConfirmed = false;
    public loginInProgress = false;
    public fromRegistration = false;
    public emailConfirmed = false;
    public resetCompleated = false;
    public registerInvitedCompleated = false;
    public messages:Messages;

    public previousUrl: string = '';

    constructor(private securityService: SecurityService, private messagesService:MessagesService, private router: Router, private activatedRoute: ActivatedRoute, private acs: AppChangeService) {
        router.events.filter(event => event instanceof NavigationEnd).subscribe(e => {
            this.previousUrl = e.toString();
        });
    }

    ngOnInit() {
        // this.messagesService.translate(new Messages()).subscribe(data=>this.messages = data);
        this.messages = new Messages();
        
        this.emergencyLogout = Cookie.existsAndDelete(AppDefinitions.emergencyLogout);
        this.emailConfirmed = this.activatedRoute.snapshot.params['emcom'];
        this.fromRegistration = this.activatedRoute.snapshot.params['rc'];
        this.resetCompleated = this.activatedRoute.snapshot.params['recom'];
        this.registerInvitedCompleated = this.activatedRoute.snapshot.params['rci'];
        this.serverError = this.activatedRoute.snapshot.params['err'];
    }

    loginSuccess(data: UserInfoModel) {
        this.loginInProgress = false;
        if (data.status === true) {
            this.loginIncorrect = false;
            Security.setUserInfoCookies(data);

            this.acs.emitChange(this.acs.events.reload_profile);

            this.router.navigate(['company']);
        } else
            if (data.response === "Email not confirmed")
                this.loginNotConfirmed = true;
            else
                this.loginIncorrect = true;
    }

    loginCallError(error: any) {
        this.loginInProgress = false;
    }

    login(username: string, password: string, rem:boolean, valid:boolean) {
        if (!valid || this.loginInProgress)
            return;
        this.loginIncorrect = false;
        this.loginNotConfirmed = false;
        this.loginInProgress = true;

        this.securityService.login(username, password).subscribe(
            data => this.loginSuccess(data), error => this.loginCallError(error),
            () => console.log('login finished'),
        );
    }
}

class Messages {
    login_incorrect = MessageDefinitions.login_incorrect;
    account_not_confirmed = MessageDefinitions.account_not_confirmed;
    no_confirmation_msg = MessageDefinitions.no_confirmation_msg;
    no_account_yet = MessageDefinitions.no_account_yet;
    email_confirmed = "Thank you, your email has been confirmed";
    registration_succesfull = "Registration has been succesfull, check your inbox for instructions to activate your account";
    did_forget_password = "Forgot?";
    reset_compleated = "You have succesfully reset your password";
    register_invited_compleated = "Registarion has been succesfull you can login to the application using your creditionals";
    server_error = "Server found error, you have been automatically logged out. Error was reported and we will fix it as soon as possible."
    email_or_login = "Email or Username";
    sign_in = "Sign In";
    password = "Password";
    remember_me = "Remember me next time";
    login = "Login";
}