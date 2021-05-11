import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { LoginModalService } from './login-modal.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Security } from '../tools/security';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('150ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('150ms', style({ opacity: 0 }))
        ])
      ]
    )
  ]
})
export class LoginModalComponent implements OnInit {

  formError?: string;
  isLoading = false;
  login = '';
  loginError?: string;
  password = '';
  passwordError?: string;

  constructor(public loginModalService: LoginModalService, public http: Http) {
    loginModalService.loginModalVisibilityChange.subscribe(isVisible => {
      if(isVisible) {
        window.addEventListener('keyup', this.onKeyUp);
        document.body.style.overflow = 'hidden';
      } else {
        window.removeEventListener('keyup', this.onKeyUp);
        document.body.style.overflow = 'auto';
      }
    });
  }

  ngOnInit() {}

  submitForm = (e: KeyboardEvent) => {
    e.preventDefault();
    this.formError = undefined;
    this.isLoading = true;
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.http.post(
      // 'http://app.snarto.com/backend/web/security/login',
      '/backend/web/security/login',
      JSON.stringify({ username: this.login, password: this.password }),
      new RequestOptions({ headers })
    ).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        const data = res.json();
        if (data.status) {
          console.log('correct', data);
          Security.setUserInfoCookies(data);
          window.location.href = 'http://app.snarto.com/customer/dashboard';
        } else {
          console.log(data);
          if (data.response === 'ERR') {
            this.formError = 'Wrong password';
          } else {
            this.formError = data.response;
          }
        }
      } else {
        console.log('err', res);
        this.formError = 'Something went wrong, try again';
      }
    });
    // backend/web/security/login
  }

  changeLogin = (val: string) => {
    this.login = val;
    this.loginError = undefined;
  }
  
  changePassword = (val: string) => {
    this.password = val;
    this.passwordError = undefined;
  }

  close() {
    this.loginModalService.setLoginModalVisibility(false);
  }

  onKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.close();
    }
  }

}
