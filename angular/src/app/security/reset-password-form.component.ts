import { Component, OnInit, transition } from '@angular/core';
import { Location } from '@angular/common';
import { SecurityService } from './security.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../messages/messages.service';
import { AppResponses } from '../responses';

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./security.css']
})
export class ResetPasswordFormComponent implements OnInit {
  sending = false;
  working = false;
  messages: Messages;
  passFormatInvalid = false;
  passNotEqual = false;
  tokenError = false;

  key: string;
  constructor(private ss: SecurityService, private location: Location, private route: ActivatedRoute, private router: Router, private msgSrv: MessagesService) { }

  goBack() {
    this.location.back();
  }

  resetPassword(pass: string, repeat: string) {
    console.log(pass + repeat);
    this.passNotEqual = this.passFormatInvalid = false;

    if (!pass || !repeat){
      return;
    }
    if (pass.length < 8) {
      this.passFormatInvalid = true;
      return;
    }
    if (pass != repeat) {
      this.passNotEqual = true;
      return;
    }

    this.sending = true;
    this.ss.changePasswordReset(pass, this.key).subscribe(data => {
        this.sending = false;
        if (!data.status)
          this.tokenError = true;
        else
          this.router.navigate(['/login', { recom: 1 }]); /*recom reset compleated */
        },
      err => {
        this.sending = false;
      }
    );
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.key = params['key'];
    });
    this.msgSrv.translate(new Messages()).subscribe(data => {
      this.messages = data;
      this.working = false;
    });
  }
}
class Messages {
  current_password = "Current Password";
  new_password = "New Password";
  repeat_password = "Prepeat Password";
  save = "Save";
  reset_password = "Reset Password";
  token_error = "Token expired or not valid";
  pass_not_equal = "Password is not equal";
  pass_invalid = "Password should be minimum 8 letters";
  change_password = "Change Password";
  cancel = "Cancel";
}
