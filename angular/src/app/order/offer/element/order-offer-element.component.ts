import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OrderOfferModel } from '../order-offer.model';
import { MessagesService } from '../../../messages/messages.service';
import { SystemMode } from '../../../top/system-mode';
import { OrderOfferService } from '../order-offer.service';
import { OrderService } from '../../order.service';
import { OrderModel } from '../../order.model';
import { Helpers } from '../../../tools/helpers';
import { CommentModel } from '../../../comments/comment.model';
import { CommentsService } from '../../../comments/comments.service';
import { CurrencyModel } from '../../../common/currency.model';

@Component({
  selector: 'order-offer-element',
  templateUrl: './order-offer-element.component.html',
  styleUrls: ['./order-offer-element.component.css']
})

export class OrderOfferElementComponent implements OnInit {
  @Input() offer: OrderOfferModel;
  @Input() currency = CurrencyModel;
  @Input() order: OrderModel;

  @Output() onEditOfferClick = new EventEmitter<boolean>();
  @Output() onSelectOffer = new EventEmitter<OrderOfferModel>();
  @Output() onCompleated = new EventEmitter<boolean>();

  working = false;
  messages: Messages;
  showChooseBox = false;
  confirmComplete = false;
  showMessageButton = false;
  completing = false;
  showCompleteButton = false;
  isOfferOwner: boolean;
  role = new SystemMode();
  showCommentsForm: boolean;
  comment: CommentModel;

  constructor(private messagesService: MessagesService, private orderService: OrderService, private commentsService: CommentsService) {
  }

  ngOnInit() {
    this.working = true;
    console.log(this.offer)
    this.isOfferOwner = Helpers.isOfferOwner(this.offer.company_user_id);
    this.messagesService.translate(new Messages()).subscribe(data => {
      this.messages = data;
      this.commentsService.getByOrderId(this.order.id).subscribe(data => {
        if (data.contact_rating)
          this.comment = data
        this.working = false;
      });
    });
    if (this.isOfferOwner && this.offer.is_selected == true && this.order.status != 'compleated')
      this.showCompleteButton = true;
  }


  completeOrderDialogResult(b: boolean) {
    if (b) {
      this.completing = true;
      this.orderService.complete(this.offer.order_id).subscribe(data => {
        this.confirmComplete = false;
        this.showCompleteButton = false;
        this.completing = false;
        this.onCompleated.emit(true);
      });
    } else
      this.confirmComplete = false;
  }

  compleateOffer() {
    this.confirmComplete = true;
  }

  editClick() {
    this.onEditOfferClick.emit(true);
  }

  commentsFormAction(c: CommentModel) {
    this.showCommentsForm = false;
    this.comment = c;
  }

  onChooseOffer(result: boolean) {
    //when user click from dialog box
    this.showChooseBox = false;
    if (result == false)
      return
    this.offer.is_selected = true;
    this.onSelectOffer.emit(this.offer);
  }
}
class Messages {
  order_from = "Order From";
  price = "Price";
  date = "Date of execution"
  send_message = "Message";
  choose_offer = "Choose Offer";
  update_offer = "Update Offer";
  complete = "Complete";
  rate = "Rate";
  comment = "Comment";
  offer_from = "Offer From";
  sure_complete = "Are you sure you want to complete this order?";
}