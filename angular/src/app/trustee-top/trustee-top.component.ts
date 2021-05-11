import { Component, OnInit } from '@angular/core';
import { UserInfoModel } from '../security/user-info.model';
import { SecurityService } from '../security/security.service';
import { AppChangeService } from '../app-change.service';
import { MessagesService } from '../messages/messages.service';
import { AppDefinitions } from '../definitions';
import { Cookie } from '../tools/cookie';

@Component({
  selector: 'app-trustee-top',
  templateUrl: './trustee-top.component.html',
  styleUrls: ['./trustee-top.component.css']
})
export class TrusteeTopComponent implements OnInit {

  working=false;
  messages:Messages;
  notification_num = 0;
  message_num = 0;
  userInfo: UserInfoModel;
  system_ver = AppDefinitions.system_ver;
  constructor(private securityService: SecurityService, private acs:AppChangeService, private msgSrv:MessagesService) { }
  ngOnInit() {
    Cookie.setCookie(AppDefinitions.appModCookieName, AppDefinitions.trusteeModVal);
    this.msgSrv.translate(new Messages()).subscribe(data=>{
      this.messages = data;
      this.working = false;
      this.securityService.getUserInfo().subscribe(data=>this.userInfo = data);
    }
    );

  }
  logout(){
    this.acs.emitChange(this.acs.events.logout);
  }
}
class Messages{
    user = "User";
    order = "Order";
    payments = "Payments";
    settings = "Settings";
    company = "Company";
    logout = "Logout";
    list = "List";
    customer = "Customer";
    messages = "Messages";
    dashboard = "Dashboard";
    notifications = "Notifications";
    invoices = "Invoices";
    open = "Open";
    closed = "Closed";
    cancelled= "Cancelled";
    expectant = "Expectant";
    compleated = "Compleated";
    awaiting = "Awaiting";
    executing = "Executing";
    unrealized = "Unrealized";
}
