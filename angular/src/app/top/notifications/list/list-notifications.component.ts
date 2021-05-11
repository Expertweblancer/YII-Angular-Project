import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../../messages/messages.service';
import { NotificationsModel } from '../notifications.model';
import { NotificationsService } from '../notifications.service';
import { AgoDateFormatMessagesModel } from '../../../ago-date-format/ago-date-format-messages.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './list-notifications.component.html',
  styleUrls: ['./list-notifications.component.scss']
})
export class ListNotificationsComponent implements OnInit {
  messages: Messages;
  agoComponentMessages: AgoDateFormatMessagesModel;
  notifications: NotificationsModel[];
  working = false;

  constructor(private messagesService: MessagesService,
    private route: ActivatedRoute,
    private router: Router, 
    private notificationsService: NotificationsService) { }

  getPreText(cat: string) {
  }
  delete(i: number) {
    this.notificationsService.delete(this.notifications[i].id).subscribe(data=>{
      this.notifications.splice(i, 1);
    });
  }
  //notf.category=='invoice-set'?['../invoices']:['../order', notf.order_id]"
  notificationClick(order_id: number, category: string) {
    if (category == 'invoice-set')
      this.router.navigate(['../invoices'], {relativeTo: this.route});
    else
      this.router.navigate(['../order', order_id], {relativeTo: this.route});
  }

  getNotificationText(cat: string, text: string, price: string = null) {
    let retVal: string;
    let orderTitle = ` <b>${text}</b>`;

    let priceInfo = ''
    if (price)
      priceInfo = `. ${this.messages.price}: ${price}`;

    switch (cat) {
      case "new-offer": retVal = this.messages.offer_added + orderTitle + priceInfo; break;
      case "update-offer": retVal = this.messages.offer_update + orderTitle + priceInfo; break;
      case "offer-priced": retVal = this.messages.offer_priced + orderTitle + priceInfo; break;
      case "won-offer": retVal = this.messages.offer_won + orderTitle; break;
      case "offer-lost": retVal = this.messages.offer_lost + orderTitle; break;
      case "order-compleated": retVal = this.messages.your_order + orderTitle + ' ' + this.messages.has_been_compleated;
      case "offer-rated": retVal = this.messages.you_have_been_rated + orderTitle;
    }
    return retVal
  }

  ngOnInit() {
    this.working = true;
    this.messagesService.translate(new AgoDateFormatMessagesModel).subscribe(data => {
      this.agoComponentMessages = data;
      this.messagesService.translate(new Messages).subscribe(data => {
        this.messages = data;
        this.notificationsService.list().subscribe(data => {
          this.notifications = data;
          this.working = false;
        })
      });
    })
  }
}

class Messages {
  no_notifications = "You have no any notifications";
  offer_added = "Offer has been added to your order";
  offer_update = "Offer has been updated to your order";
  offer_priced = "Your offer has just been priced. Order: "
  offer_won = "Congratulations! Your offer has been selected. Order: ";
  offer_lost = "Your offer has not been selected. Order: ";
  your_order = "Your order ";
  has_been_compleated = "has been compleated";
  price = "Price";
  you_have_been_rated = "Your service has been rated. Order: ";
}