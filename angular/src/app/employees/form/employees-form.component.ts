import { Component, OnInit } from '@angular/core';
import { InviteService } from '../invite.service';
import { InviteModel } from '../invite.model';
import { AppResponses } from '../../responses';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagesService } from '../../messages/messages.service';

@Component({
  selector: 'invite',
  templateUrl: './employees-form.component.html',
  styleUrls: ['./employees-form.component.css']
})
export class EmployeesFormComponent implements OnInit {
  public working=false;
  public invitedUsers:InviteModel[];
  messages = Messages;
  model = new InviteModel();
  inviteResult="";
  sending = false;
  constructor(private inviteService:InviteService, private messagesService:MessagesService, private router:Router, private route:ActivatedRoute) { }
  
  ngOnInit(){
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages = data);
    this.inviteService.getInvitedList().subscribe(data=>{
      this.invitedUsers = data;
      this.working      = false;
    });
  }

  onSubmit(){
    console.log(this.model);
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(this.model.email)){
      this.inviteResult = 'invalid-email';
      return;
    }
    this.sending=true;
    this.inviteService.invite(this.model).subscribe(data=>{
      console.log(data);
      this.sending = false;

      if (data.status==true){
        this.inviteResult = "success";

        if (data.response == AppResponses.RESPONSE_NEW_USER)
          this.invitedUsers.unshift(data);
        if (data.response == AppResponses.RESPONSE_USER_REGISTERED_UPDATING_PROFILE)
          this.inviteResult = "already-registered"
        this.model = new InviteModel();
        this.router.navigate(['../list'], {relativeTo:this.route})
      }
      else
          this.inviteResult = "already-exists";
    }, err=>{
      this.inviteResult = "error";
      this.sending=false;
      console.log(err);
    });
  }
}

class Messages{
  email= "Email";
  name="Name";
  surname="Surname";
  phone="Phone Number";
  new_employee="New Employee";
  already_registered_updating_profile = "User was already registered. Just added to your company";
  invitation_sent="Invitation sent";
  invalid="Email format not valid";
  already_exists = "User already exists";
  invitation_error = "Invitation sending error";
  enter_email = "Enter Email";
  invite = "Invite"
  invited_users = "Invited Users";
  invitation_date = "Invitation Date";
}