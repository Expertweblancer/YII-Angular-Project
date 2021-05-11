import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessagesService } from '../../messages/messages.service';
import { ProfileUserModel } from './profile-user.model';
import { Helpers } from '../../tools/helpers';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {
  
  @Input() formGroup:FormGroup;
  
  readonly = true; 
  is_pass_ok=true;
  
  constructor(private messagesService:MessagesService) { }
  messages:Messages;

  ngOnInit() {
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages = data);
  }

}
class Messages{
  email = "Email";
  username = "Username"
  password = "Password";
  password_retype = "Re-type password";
  pass_not_ok = "Passwords are not matching";
}