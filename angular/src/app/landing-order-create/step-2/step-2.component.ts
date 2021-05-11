import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { LandingMessages } from '../landing-messages';
import { CurrencyModel } from '../../common/currency.model';
import { AddressModel } from '../../google-maps/address.model';
import { PaymentTypesModel } from '../../common/payment-types.model';
import { OrderModel } from '../../order/order.model';
import { Helpers } from '../../tools/helpers';

@Component({
  selector: 'step-2',
  templateUrl: './step-2.component.html',
  styleUrls: ['./step-2.component.css'],
})
export class Step2Component implements OnInit {
  @Input() model: OrderModel = new OrderModel();
  canNext = false;
  routeNotFoundErr = false;
  min_date_to: string;
  min_date_from: string;
  date_from: Date;
  date_to: Date;

  @Input() currencies: CurrencyModel[];
  @Input() paymentTypes: PaymentTypesModel[];
  @Input() messages: LandingMessages;
  @Output() onGoNext = new EventEmitter<OrderModel>();
  @Output() onGoBack = new EventEmitter<boolean>();

  addressTheSameErr = false;

  constructor(private zone: NgZone) { }
  ngOnInit() {
    let date = Helpers.formatDate();
    this.min_date_from = date;
    if (!this.model.date_from) {
      this.model.date_to = date;
      this.model.date_from = date;
      this.min_date_to = date;
    }
    else {
      this.date_from = new Date(this.model.date_from);
      this.date_to = new Date(this.model.date_to);
      this.min_date_to = this.model.date_from;
    }
  }

  prev() {
    this.onGoBack.emit(true);
  }

  onDateToChange(val: any) {
    this.model.date_to = Helpers.formatDate(val.args.newValue);
  }

  onDateFromChange(val: any) {
    let date = Helpers.formatDate(val.args.newValue);
    console.log(date);
    this.model.date_from = date;
    this.min_date_to = date;
    let dateTo = new Date(this.model.date_to).getTime();
    let dateFrom = new Date(date).getTime();
    if (dateTo < dateFrom) {
      console.log('date from bigger than date to')
      console.log(dateTo, dateFrom)
      this.model.date_to = date;
      this.date_to = new Date(date);
    }
  }

  onSubmit() {
    if (this.model.to_lat && this.model.from_lat && !this.addressTheSameErr)
      this.onGoNext.emit(this.model);
  }

  onModelChange() {
  }

  onDirectionSet(distance: number) {
    this.zone.run(() => {
      this.model.distance = distance;
      if (!distance)
        this.routeNotFoundErr = true;
      else
        this.routeNotFoundErr = false;
    });
  }

  onFromPlacesChanged(address: AddressModel) {
    this.model.from_lat = null;
    console.log(address);
    if (!address)
      return;
    this.zone.run(() => {
      this.model.from_address = address.address;
      this.model.from_lat = address.lat;
      this.model.from_long = address.lng;
      this.model.from_country_short = address.country_short;
      this.model.from_city = address.city;
      if (this.model.from_address == this.model.to_address && this.model.to_address && this.model.to_address.length > 0)
        this.addressTheSameErr = true;
      else
        this.addressTheSameErr = false;
    });
  }

  onToPlacesChanged(address: AddressModel) {
    this.model.to_lat = null;
    if (!address)
      return;
    this.zone.run(() => {
      this.model.to_address = address.address;
      this.model.to_lat = address.lat;
      this.model.to_long = address.lng;
      this.model.to_country_short = address.country_short;
      this.model.to_city = address.city;
      if (this.model.from_address == this.model.to_address && this.model.from_address && this.model.from_address.length > 0)
        this.addressTheSameErr = true;
      else
        this.addressTheSameErr = false;
    });
  }
}
