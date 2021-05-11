import { Component, OnInit } from '@angular/core';
import { SecurityService } from './security.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MessagesService} from '../messages/messages.service';

@Component({
  selector: 'app-reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./security.css']
})
export class ResetPasswordRequestComponent implements OnInit {
  messages: Messages;
  resetPassOk = false;
  emailNotExists = false;
  sending=false;
  constructor(private ss:SecurityService, private messagesService:MessagesService, private location:Location, private route:ActivatedRoute) {}
  
  goBack(){
    this.location.back();
  }
  ngOnInit(){
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages = data);
  }
  resetPasswordRequest(email:string, valid:boolean){
    if (!valid)
      return;
    this.resetPassOk = false;
    this.emailNotExists = false;
    this.sending = true;
    this.ss.resetPassword(email).subscribe(
      data=>{
        this.sending = false;

        if (data.status)
          this.resetPassOk = true;
        else
          this.emailNotExists = true;
      }
    );
  }
}
class Messages{
   reset_password_ok       = "Check email to find reset password instructions";
   email_not_exists        = "Email not exists in our database";
   reset_password          = "Reset Password";
   email = "Email";
   reset = "Reset";
   cancel = "Cancel";
}
