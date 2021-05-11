import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../messages/messages.service';
import { LandingMessages } from './landing-messages';
import { CurrencyModel } from '../common/currency.model';
import { CurrencyService } from '../common/currency.service';
import { PaymentTypesModel } from '../common/payment-types.model';
import { PaymentTypesService } from '../common/payment-types.service';
import { LandingOrderModel } from './landing-order.model';
import { ParcelModel } from '../order/parcel/parcel.model';
import { LandingOrderCreateService } from './landing-order-create.service';
import { OrderModel } from '../order/order.model';
import { SecurityService } from '../security/security.service';
import { OrderService } from '../order/order.service';
import { OrderTimeService } from '../order/other/order-time.service';
import { OrderTimeModel } from '../order/other/order-time.model';
import { ParcelService } from '../order/parcel/parcel.service';

@Component({
  templateUrl: './landing-order-create.component.html',
  styleUrls: ['../security/security.css', './landing-order-create.component.css'],
  providers: [LandingOrderCreateService]
})
export class LandingOrderCreateComponent implements OnInit {
  /**/
  model: LandingOrderModel = new LandingOrderModel();
  messages: LandingMessages;
  currencies: CurrencyModel[];
  paymentTypes: PaymentTypesModel[];
  saving = false;

  colStep1Class: string;
  colStep2Class: string;
  colStep3Class: string;
  colStep4Class: string;

  pointStep1Class: string;
  pointStep2Class: string;
  pointStep3Class: string;
  pointStep4Class: string;

  step = 1;

  constructor(
    private messagesService: MessagesService,
    private currencyService: CurrencyService,
    private paymentTypesService: PaymentTypesService,
    private securityService: SecurityService,
    private orderService: OrderService,
    private parcelService: ParcelService,
    private orderTimeService: OrderTimeService) { }

  onCategorySelect(id: number) {
    this.model.order.category_id = id;
    this.goNext();
  }

  onParcelsSet(parcels: ParcelModel[]) {
    this.model.parcels = parcels;
    this.goNext();
  }

  onOrderSet(order: OrderModel) {
    console.log(order);
    this.model.order = order;
    this.goNext();
  }

  goNext() {
    this.step++;
    this.modifyClasses();
    if (this.step == 5) {
      let key: string;
      let orderID: number;
      this.securityService.register(this.model.auth.email, this.model.auth.username, this.model.auth.password).subscribe(data => {
        if (data.status == true) {
          key = data.auth_key;
          this.model.order.user_id = data.user_id;
          this.orderService.set(this.model.order, key).subscribe(resp => {
            if (resp.id) {
              orderID = resp.id;
              this.parcelService.createMultiple(this.model.parcels, orderID, key).subscribe(data => {
                console.log(data);

                let orderTimeModel = new OrderTimeModel();
                orderTimeModel.id_order = orderID;
                orderTimeModel.delivery_since_1 = "08:00";
                orderTimeModel.delivery_until_1 = "17:00";
                orderTimeModel.sending_since_1 = "08:00";
                orderTimeModel.sending_until_1 = "17:00";
                this.orderTimeService.set(orderTimeModel, key).subscribe(data => {
                  console.log(data);

                  this.step++;
                });
              });
            }
          })
        }
      })
    }
  }

  goBack() {
    if (this.step > 0) {
      this.step--;
      this.modifyClasses();
    }
  }

  modifyClasses() {
    let point_basic = 'point d-flex justify-content-center align-items-center';
    let col_basic = "col-3 d-flex flex-column align-items-center border-top point-column"
    let active = ' active';
    let done = ' done';

    this.resetClasses(point_basic, col_basic);

    switch (this.step) {
      case 1:
        this.colStep1Class = col_basic + active;
        this.pointStep1Class = point_basic + active;
        break;
      case 2:
        this.colStep1Class = col_basic + done + active;
        this.colStep2Class = col_basic + active;
        this.pointStep1Class = point_basic + done;
        this.pointStep2Class = point_basic + active;
        break;
      case 3:
        this.colStep1Class = col_basic + done + active;
        this.colStep2Class = col_basic + done + active;
        this.colStep3Class = col_basic + active;
        
        this.pointStep1Class = point_basic + done;
        this.pointStep2Class = point_basic + done;
        this.pointStep3Class = point_basic + active;
        break;
      case 4:
        this.colStep1Class = col_basic + done + active;
        this.colStep2Class = col_basic + done + active;
        this.colStep3Class = col_basic + done + active;
        this.colStep4Class = col_basic + active;
        
        this.pointStep1Class = point_basic + done;
        this.pointStep2Class = point_basic + done;
        this.pointStep3Class = point_basic + done;
        this.pointStep4Class = point_basic + active;
        break;
    }
  }

  resetClasses(pointCss: string, colCss: string) {
    this.pointStep1Class = pointCss;
    this.pointStep2Class = pointCss;
    this.pointStep3Class = pointCss;
    this.pointStep4Class = pointCss;
    this.colStep1Class = this.colStep2Class = this.colStep3Class = this.colStep4Class = colCss;
  }

  ngOnInit() {
    this.modifyClasses();
    this.messagesService.translate(new LandingMessages()).subscribe(data => {
      this.messages = data;
    });
    this.currencyService.getList().subscribe(data => {
      this.currencies = data;
    });
    this.paymentTypesService.getList().subscribe(data => this.paymentTypes = data);

  }
}
