import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MessagesService } from '../../../messages/messages.service';
import { OrderOfferService } from '../order-offer.service';
import { FleetService } from '../../../fleet/fleet.service';
import { OrderOfferModel } from '../order-offer.model';
import { Helpers } from '../../../tools/helpers';
import { FleetModel } from '../../../fleet/fleet.model';
import { CurrencyModel } from '../../../common/currency.model';
import { OrderModel } from '../../order.model';

@Component({
  selector: 'order-offer-form',
  templateUrl: './order-offer-form.component.html',
  styleUrls: ['./order-offer-form.component.css']
})
export class OrderOfferFormComponent implements OnInit {
  messages: Messages;
  working = false;
  @Input() offer: OrderOfferModel;
  @Input() order: OrderModel;
  @Input() currency: CurrencyModel;
  @Output() onChange = new EventEmitter<boolean>();

  sending = false;

  disp_date: string;
  min_date: string;
  date_execution:string;

  fleetModel: FleetModel[];
  constructor(private messagesService: MessagesService,
    private orderOfferService: OrderOfferService,
    private fleetService: FleetService) {
    this.min_date = Helpers.formatDate();
  }

  ngOnInit() {
    this.working = true;
    if (!this.offer) 
    {
      this.offer = new OrderOfferModel();
      this.offer.order_id = this.order.id;
      this.offer.date_execution = Helpers.formatDate();
    } else
    {
      this.date_execution = this.offer.date_execution;
    }

    this.messagesService.translate(new Messages()).subscribe(data => {
      this.messages = data;
      this.fleetService.get().subscribe(data => {
        this.fleetModel = data;
        this.working = false;
      });
    });
  }

  onDateChange(val: any) {
    this.offer.date_execution = Helpers.formatDate(val.args.newValue);
  }

  onOfferSubmit() {
    console.log(this.offer);
    if (!this.offer.date_execution || !this.offer.your_price || this.sending)
      return;

    this.sending=true;

    this.orderOfferService.post(this.offer).subscribe(data => {
      this.onChange.emit(data);
      console.log(data);
      this.sending=false;
    })
  }
}

class Messages {
  set_offer = 'Place your offer';
  your_price = "Your Price";
  choose_car = "Choose Car";
  submit = "Submit";
  min_price = "Min. Price";
  date = "Date";
  comment = "Comment";
  to_assign_fleet = "To assign fleet you need to first creat one";
  here = "here";
  dates_error = "Date cannot be earlier than today";
  date_too_late = "Date cannot be later than in the next 3 years";
}