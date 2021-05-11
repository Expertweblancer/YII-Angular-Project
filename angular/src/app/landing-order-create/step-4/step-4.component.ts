import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LandingMessages } from '../landing-messages';
import { Auth } from '../landing-order.model';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'step-4',
  templateUrl: './step-4.component.html',
  styleUrls: ['./step-4.component.css'],
})
export class Step4Component implements OnInit {
  canNext = false;
  emailFormatInvalid = false;
  emailExists = false;
  usernameExists = false;
  emailChecked = false;
  usernameChecked = false;


  @Input() messages: LandingMessages;
  @Output() onGoNext = new EventEmitter<Auth>();
  @Output() onGoBack = new EventEmitter<boolean>();
  @Input() model: Auth;

  constructor(private securityService: SecurityService) { }

  ngOnInit() { }

  onSubmit() {
    if (!this.usernameChecked)
    {
      this.checkUsername();
      return;
    }
    if (!this.emailChecked)
    {
      this.checkEmail();
      return;
    }
    if (this.emailExists || this.usernameExists || this.emailFormatInvalid)
      return;
    this.onGoNext.emit(this.model);
  }

  prev() {
    this.onGoBack.emit(true);
  }

  checkEmail() {
    this.emailChecked = true;
    this.emailExists = false;
    if (!this.model.email || this.model.email.length == 0)
      return;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.model.email)) {
      this.emailFormatInvalid = true;
      return;
    } else
      this.emailFormatInvalid = false;
    
    this.securityService.checkEmail(this.model.email).subscribe(data => {
      if (!data.status)
        this.emailExists = true;
      else
        this.emailExists = false;
    })
  }

  checkUsername() {
    console.log(this.model);
    this.usernameChecked = true;      
    
    this.usernameExists =false;
    if (!this.model.username || this.model.username.length == 0)
      return;
    
    this.securityService.checkUsername(this.model.username).subscribe(data => {
      if (data.status == false)
        this.usernameExists = true;
      else
        this.usernameExists = false;
    })
  }
}
