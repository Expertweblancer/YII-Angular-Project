import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInfoModel } from '../security/user-info.model';
import { SecurityService } from '../security/security.service';
import { AppChangeService } from '../app-change.service';
import { Helpers } from '../tools/helpers';
import { MessagesService } from '../messages/messages.service';
import { Cookie } from '../tools/cookie';
import { AppDefinitions } from '../definitions';
import { MiscService } from '../top/misc.service';
import { TopMenuOrderStatusModel } from '../top/top-menu-order-status.model';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-company-top',
  templateUrl: './company-top.component.html',
  styleUrls: ['./company-top.component.css']
})
export class CompanyTopComponent implements OnInit, OnDestroy {
  all          = "all";
  working      = false;
  messages     : Messages;
  userInfo     : UserInfoModel;

  // Subscription object
  private timerSubscr: Subscription; 

  private subscription: Subscription; 
  
  numOfUnread
  ordersStatus : TopMenuOrderStatusModel;
  constructor(private messagesService:MessagesService, private miscService:MiscService, private acs:AppChangeService  ) { }

  ngOnInit() {
      this.working = true;
      Cookie.setCookie(AppDefinitions.appModCookieName, AppDefinitions.companyModVal);
      

      this.messagesService.translate(new Messages()).subscribe(data=> {
        this.messages = data;
      }); 
      this.timerSubscr = TimerObservable.create(0, 10000).subscribe(() => {
        if (this.subscription)
          this.subscription.unsubscribe();
            
        this.subscription = this.miscService.getOrdersStatus(true /* is_company = true*/).subscribe(data=>{
            
          this.ordersStatus = data;
          this.working  = false;            
        })
      });
 
  }
  ngOnDestroy(){
    if (this.timerSubscr)
      this.timerSubscr.unsubscribe();
  }
  logout(){
    this.acs.emitChange(this.acs.events.logout);
  }
  scrollToTop() {
    const mainPanelEl = document.getElementsByClassName('main-panel')[0];
    if (mainPanelEl) {
      mainPanelEl.scrollBy({ top: -mainPanelEl.scrollHeight, behavior: 'smooth'})
    }
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
    search = "Search";
    closed = "Closed";
    cancelled= "Cancelled";
    to_execute = "To Execute";
    compleated = "Compleated";
    offering = "Offering";
    executing = "Executing";
    unrealized = "Unrealized";
    finances = "Finances";
    employees = "Employees";
    fleet = "Fleet";
    working_fleet = "Working Fleet";
    idle_fleet = "Idle Fleet";
    all_fleet = "All Fleet";
}
