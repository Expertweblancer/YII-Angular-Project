import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security/security.service';
import { UserInfoModel } from '../security/user-info.model';
import { AppDefinitions } from '../definitions';
import { AppChangeService } from '../app-change.service';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'app-admin-top',
  templateUrl: './admin-top.component.html',
  styleUrls: ['./admin-top.component.css']
})
export class AdminTopComponent implements OnInit {
  
  working = false;
  system_ver = AppDefinitions.system_ver;
  userInfo: UserInfoModel;
  messages = new Messages();
  constructor(private messageService:MessagesService, private securityService: SecurityService, private acs:AppChangeService) { }

  ngOnInit() {
    this.working = true;
    this.messageService.translate(this.messages).subscribe(data=>this.messages = data);
    this.securityService.getUserInfo().subscribe(
      data=>{
        this.userInfo = data;
        this.working = false;
    });
  }
  logout(){
    this.acs.emitChange('logout');
  }
}
class Messages {
  user_list = "User List";
  dashboard = "Dashboard";
  notifications = "Notifications";
  messages = 'Messages';
  translations = 'Translations';
  logout = 'Logout';
  profile = 'Profile';
  currencies = "Currencies"
}  
