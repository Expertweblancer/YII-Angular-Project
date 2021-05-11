import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserMessageService } from '../user-message.service';
import { UserMessageModel } from '../user-message.model';
import { MessagesService } from '../../../messages/messages.service';
import { SystemMode } from '../../system-mode';
import { AppChangeService } from '../../../app-change.service';
import { Cookie } from '../../../tools/cookie';
import { AppDefinitions } from '../../../definitions';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { AgoDateFormatMessagesModel } from '../../../ago-date-format/ago-date-format-messages.model';
import { OrderService } from '../../../order/order.service';
import { OrderModel } from '../../../order/order.model';
import { Location } from '@angular/common';
import { Helpers } from '../../../tools/helpers';
import { log } from 'util';
import { CategoryService } from '../../../category/category.service';
import { CategoryModel } from '../../../category/category.model';

@Component({
  selector: 'app-user-messages-view',
  templateUrl: './user-messages-view.component.html',
  styleUrls: ['./user-messages-view.component.css']
})
export class UserMessagesViewComponent implements OnInit, OnDestroy {
  working = false;
  sending = false;
  systemMode = new SystemMode();

  messages: Messages;
  userMessages: UserMessageModel[] = [];
  model: UserMessageModel;
  agoMessagesModel: AgoDateFormatMessagesModel;
  userId: number;
  order_token: string;
  title: string;
  category: CategoryModel
  order: OrderModel;
  
  // Subscription object
  subscr: Subscription;
  @ViewChild('messagesBox') private messagesBox: ElementRef;

  constructor(private route: ActivatedRoute,
    private userMessageService: UserMessageService,
    private messagesService: MessagesService,
    private acs: AppChangeService,
    private orderService: OrderService,
    private location: Location,
    private categoryService: CategoryService) { }

  isMessageSender(msg: UserMessageModel) {
    if ((msg.direction == 'from' && this.systemMode.is_customer) || (msg.direction == 'to' && !this.systemMode.is_customer))
      return true;
    return false;
  }
  getCategoryIcon(id:number){
    return Helpers.getCategoryIcon(id);
  }
  scrollDown() {
    try {
      this.messagesBox.nativeElement.scrollTop = this.messagesBox.nativeElement.scrollHeight;
    } catch (err) {
      console.log('scroll down error');
    }
  }

  getMessages() {
    log('getting messages')
    this.userMessageService.getMessagesByOrderId(this.order.id, this.order_token, this.userId, this.systemMode.is_company).subscribe(data => {
      if (this.userMessages.length != data.length) {
        this.userMessages = data;
        this.scrollDown();
      }
      else
        console.log('no new messages!');

      // emit event about read message number;
      this.acs.emitChange(this.acs.events.num_msgs_read);
      this.working = false;
    });
  }
  goBack() {
    this.location.back();
  }


  getFileLink(file: string) {
    return Helpers.getFileUrl(file);
  }

  onUpload(file: any) {
    console.log(file);
    this.model.is_attachment = true;
    this.model.message = file[0];
    this.sendMessage();
  }

  sendMessage() {
    if (this.sending || !this.model.message || this.model.message.length == 0)
      return;
    this.sending = true;
    this.userMessageService.sendMessage(this.model).subscribe(data => {
      this.sending = false;
      this.userMessages.push(data);
      this.scrollDown();
      this.model = new UserMessageModel(data.order_id, this.order_token);
      if (!this.systemMode.is_company)
        this.model.offeree_id = this.userId;
    });
  }

  ngOnDestroy() {
    if (this.subscr)
      this.subscr.unsubscribe();
  }

  ngOnInit() {
    this.working = true;
    this.messagesService.translate(new Messages()).subscribe(data => {
      this.messages = data;
      this.messagesService.translate(new AgoDateFormatMessagesModel).subscribe(data => {
        this.agoMessagesModel = data;
        this.route.queryParams.subscribe(params => {
          this.userId = params['uid'] ? +params['uid'] : +Cookie.getCookie(AppDefinitions.authUserIdCookieName);
          this.order_token = params['token'];
          this.orderService.getOrder(+params['oid'], this.order_token).subscribe(data => {
            this.order = data;
            this.model = new UserMessageModel(this.order.id, this.order_token);
            this.categoryService.getCategory(this.order.category_id).subscribe(data=>this.category = data)
            if (!this.systemMode.is_company)
              this.model.offeree_id = this.userId;
            this.subscr = TimerObservable.create(0, 10000).subscribe(() => this.getMessages());
          });
        });
      });
    });
  }
}
class Messages {
  send = "Send";
  you = "You";
  go_back = "Go Back";
}