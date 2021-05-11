import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OrderOfferModel } from '../order-offer.model';
import { OrderOfferService } from '../order-offer.service';
import { MessagesService } from '../../../messages/messages.service';
import { Helpers } from '../../../tools/helpers';

@Component({
  selector: 'choose-offer-box',
  templateUrl: './choose-offer-box.component.html',
  styleUrls: ['./choose-offer-box.component.css']
})
export class ChooseOfferBoxComponent implements OnInit {
  @Output() result = new EventEmitter<boolean>();
  @Input() offer: OrderOfferModel;
  sending = false;
  working = false;
  agree = false;
  showWarning = false;
  messages: Messages;
  terms_link: string;

  constructor(private orderOfferService: OrderOfferService, private messagesService: MessagesService) {
    this.terms_link = Helpers.getBaseUrl() + 'doc/regulamin_pl.pdf';
  }

  ngOnInit() {
    this.working = true;
    this.messagesService.translate(new Messages()).subscribe(data => {
      this.messages = data;
      this.working = false;
    });
  }
  cancel() {
    this.result.emit(false);
  }
  ok() {
    if (!this.agree) {
      this.showWarning = true;
      return;
    }
    this.working = true;
    this.orderOfferService.choose(this.offer.order_id, this.offer.company_user_id).subscribe(data => {
      console.log(data);
      this.result.emit(true);
      this.working = false;
    });
  }
}
class Messages {
  are_you_sure = "I want to choose that offer";
  ok = "Ok";
  cancel = "Cancel";
  agree_with = "Agree with"
  terms = "terms and conditions";
  agree_please = "You need to agree our terms and coditions"
}