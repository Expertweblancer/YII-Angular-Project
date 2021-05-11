import { Component, OnInit } from '@angular/core';
import { SecurityService } from './security.service';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'app-resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./security.css']
})
export class ResendComponent implements OnInit {
  working = false;
  sending = false;
  constructor(private securityService:SecurityService, private msgSrv: MessagesService) { }
  resendOk = false;
  resendErr = false;
  unkownEmail = false;
  messages:Messages;

  ngOnInit() {
    this.sending = true;
    this.msgSrv.translate(new Messages()).subscribe(data=>{this.messages = data; this.sending = false;});
  }
  
  resend(email){
    this.sending = true;
    this.securityService.resend(email).subscribe(data=>{
      console.log(data);
      this.sending = false;
      if (data.status==true)
        this.resendOk = true;
      else 
        if (data.response=="User does not exists")
          this.unkownEmail = true;
        else
          this.resendErr = true
    }, err=>{
      this.sending=false;
      this.resendErr = true;
    });
  }
}

class Messages{
  login = "Login";
  resend_confirmation_link = "Resend Confirmation Link";
  email = "Email";
  resend = "Resend"
  successful = "Resend Successful";
  error = "Occured Server Error";
  unknown = "Unknown Email";
}