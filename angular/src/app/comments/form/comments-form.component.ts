import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { CommentsService } from '../comments.service';
import { MessagesService } from '../../messages/messages.service';
import { AppDefinitions } from '../../definitions';
import { OrderOfferModel } from '../../order/offer/order-offer.model';
import { OrderModel } from '../../order/order.model';
import { CommentModel } from '../comment.model';

@Component({
  selector: 'comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.css']
})
export class CommentsFormComponent implements OnInit {

  sending       = false;
  working       = false;
  agree         = false;
  comment       = new CommentModel();
  messages          : Messages;
  tryToSave = false;
  @Input() offer    : OrderOfferModel;
  @Input() order    : OrderModel;
  @Output() onAction = new EventEmitter<CommentModel>();

  constructor(private commentsService:CommentsService, private messagesService:MessagesService) { }

  ngOnInit() {
    this.working=true;
    this.messagesService.translate(new Messages()).subscribe(data=>{
      this.messages = data;
      this.working=false;
    });
    this.comment.order_id = this.order.id;
    this.comment.customer_id = this.order.user_id;
    this.comment.general_rating = 0;
    this.comment.contact_rating = 0;
    this.comment.price_rating = 0;
    this.comment.punctuality_rating = 0;
  }
  cancel(){
    this.onAction.emit(null);
  }
  ok(){
    console.log(JSON.stringify(this.comment));
    this.tryToSave = true;
    if (this.comment.contact_rating==0 
      || this.comment.price_rating == 0 || this.comment.punctuality_rating ==0){
      return;
    }
    this.sending = true;
    this.commentsService.set(this.comment).subscribe(data=>{
      console.log(data);
      this.sending=false;
      this.comment.general_rating = (this.comment.contact_rating + this.comment.punctuality_rating + this.comment.price_rating)/3;
      this.onAction.emit(this.comment);
    })
  }
}

class Messages{
  realized="Realized by:"
  rate_services = "Rate Services of ";
  ok = "Ok";
  cancel = "Cancel";
  general_rating = "General Rating";
  punctuallity ="Punctuallity";
  price = "Price";
  contact = "Contact";
  comment = "Comment";

}