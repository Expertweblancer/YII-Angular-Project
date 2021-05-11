import { Component, OnInit } from '@angular/core';
import { AppChangeService } from '../../app-change.service';
import { MessagesService } from '../../messages/messages.service';
import { Cookie } from '../../tools/cookie';
import { AppDefinitions } from '../../definitions';

@Component({
  selector: 'app-setup-profile',
  templateUrl: './setup-profile.component.html',
  styleUrls: ['../../security/security.css', './setup.css']
})
export class SetupProfileComponent implements OnInit {
  
  registeredFromLanding = false;
  showCompany=false;
  messages:Messages;
  constructor(private acs: AppChangeService, private messagesService:MessagesService) {}
  
  logout(){
    this.acs.emitChange(this.acs.events.logout);
  }

  ngOnInit() {
    this.messagesService.translate(new Messages).subscribe(data=>this.messages = data);
    console.log(Cookie.getCookie(AppDefinitions.noProfileButOrders));
    if (Cookie.getCookie(AppDefinitions.noProfileButOrders)=="true")
      this.registeredFromLanding = true;
    console.log(this.registeredFromLanding);
  }

}
class Messages{
  company = "Company";
  customer = "Customer";
  logout = "Logout";
}