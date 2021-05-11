import { Component, OnInit, OnDestroy } from '@angular/core';
import { SecurityService } from '../security/security.service';
import { UserInfoModel } from '../security/user-info.model';
import { AppChangeService } from '../app-change.service';
import { AppDefinitions } from '../definitions';
import { MessagesService } from '../messages/messages.service';
import { Cookie } from '../tools/cookie';
import { MiscService } from '../top/misc.service';
import { TopMenuOrderStatusModel } from '../top/top-menu-order-status.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-customer-top',
  templateUrl: './customer-top.component.html',
  styleUrls: ['./customer-top.component.scss']
})
export class CustomerTopComponent implements OnInit, OnDestroy {
  working          = false;
  messages         : Messages;
  showAddNewButton : boolean;
  notification_num = 0;
  message_num      = 0;
  userInfo         : UserInfoModel;
  ordersStatus     : TopMenuOrderStatusModel;
  
  // Subscription object
  private timerSubscr: Subscription; 
  private subscription: Subscription; 

  routerSubscr:Subscription;

  constructor(private securityService: SecurityService, private acs:AppChangeService, private msgSrv:MessagesService, private miscService:MiscService, private router: Router) {

   }  
  
  ngOnDestroy(){
    if (this.routerSubscr)
      this.routerSubscr.unsubscribe();
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.timerSubscr)
      this.timerSubscr.unsubscribe();
  }

  checkUrl(){
    if (this.router.url.indexOf('order/list')>=0)
      this.showAddNewButton = true;
      else
      this.showAddNewButton=false;
  }

  ngOnInit() {
    this.routerSubscr = this.router.events.subscribe(data=>{
      this.checkUrl();
    })
    this.checkUrl();
    this.working = true;
    
    Cookie.setCookie(AppDefinitions.appModCookieName, AppDefinitions.customerModVal);

    this.msgSrv.translate(new Messages()).subscribe(data=>{
      this.messages = data;
      this.securityService.getUserInfo().subscribe(data=>this.userInfo = data, err=>this.acs.emitChange(this.acs.events.srv_error));
      
      let timer = TimerObservable.create(0, 10000);
      this.timerSubscr = timer.subscribe(() => 
      this.miscService.getOrdersStatus(false /* false - not from company*/).subscribe(data=>{
        this.ordersStatus = data;
        
        this.working = false;
      }, err=>{
        console.log(err); 
      }));      
    }, err=>{
      console.log(err);
      this.acs.emitChange(this.acs.events.srv_error);
    }
    );
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
    orders = "Orders";
    order = "Order";
    payments = "Payments";
    settings = "Settings";
    profile = "Profile";
    logout = "Logout";
    list = "List";
    finance = "Finance";
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
    trustee = "Trustee"; 
    company="Company";
    add = "Add";
    add_new_order = "Add New Order";
}