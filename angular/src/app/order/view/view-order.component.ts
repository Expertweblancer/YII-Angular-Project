import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { OrderModel } from '../order.model';
import { CategoryModel } from '../../category/category.model';
import { GoogleMapsComponent } from '../../google-maps/google-maps.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrderService } from '../order.service';
import { CategoryService } from '../../category/category.service';
import { CurrencyService } from '../../common/currency.service';
import { CurrencyModel } from '../../common/currency.model';
import { OrderAttachmentsService } from '../other/order-attachments.service';
import { OrderAttachmentsModel } from '../other/order-attachments.model';
import { OrderUserModel } from '../other/order-user.model';
import { PaymentTypesModel } from '../../common/payment-types.model';
import { PaymentTypesService } from '../../common/payment-types.service';
import { ParcelModel } from '../parcel/parcel.model';
import { ParcelService } from '../parcel/parcel.service';
import { Helpers } from '../../tools/helpers';
import { AppDefinitions } from '../../definitions';
import { OrderTimeModel } from '../other/order-time.model';
import { OrderTimeService } from '../other/order-time.service';
import { OrderOfferService } from '../offer/order-offer.service';
import { OrderOfferModel } from '../offer/order-offer.model';
import { Cookie } from '../../tools/cookie';
import { SystemMode } from '../../top/system-mode';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable'
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { MessagesService } from '../../messages/messages.service';

@Component({
  selector: 'view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['../order.css']
})

export class ViewOrderComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMapsComponent)
  private googleMapsComponent: GoogleMapsComponent;

  messages: Messages;
  working = false;
  // to display info if order was updated
  orderUpdated = false;
  // main model keeping curent order
  selectedModel = new OrderModel;
  // helping data models
  categoryModel: CategoryModel;
  currencyModel: CurrencyModel;
  parcels: ParcelModel[]
  orderAttachmentsModel: OrderAttachmentsModel[] = [];
  orderUserModel: OrderUserModel;
  orderTimeModel: OrderTimeModel;
  orderOfferModel: OrderOfferModel[];
  paymentTypesModel: PaymentTypesModel;

  //offers models
  bestOrderOfferModel: OrderOfferModel;
  yourOrderOfferModel: OrderOfferModel;
  wonOrderOfferModel: OrderOfferModel;

  //used to determine if show offer box to company users
  showOfferBox: boolean;
  //switchers only,to help display data on the screen
  showDates = false;
  showParcels = false;
  showAttachments = false;
  yourOfferIsTheBest = false;
  //system mode object
  systemMode = new SystemMode();

  // Subscription object
  private timerSubscr: Subscription;

  // dysplay total kg of all parcels
  parcel_total_weight: number = 0;
  downloadUrl = Helpers.getBackendUrl() + 'upload/'

  constructor(private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private parcelService: ParcelService,
    private orderAttachmentsService: OrderAttachmentsService,
    private paymentTypesService: PaymentTypesService,
    private orderTimeService: OrderTimeService,
    private orderOfferService: OrderOfferService,
    private location: Location,
    private messageService: MessagesService,
  ) { }

  subscribeAutoRefreshOffers() {
    if (this.timerSubscr)
      this.timerSubscr.unsubscribe();
    this.timerSubscr = TimerObservable.create(0, 30000).subscribe(() => this.checkTimeOfEditOffer());
  }
  goBack() {
    this.location.back();
  }
  loadOrder(oid: number = null) {
    let order_id: number;
    if (oid)
      order_id = oid;
    else {
      if (this.selectedModel)
        order_id = this.selectedModel.id;
      else {
        console.log('view order  -  no order id! Retrun from function');
        return;
      }
    }
    // get order
    this.orderService.getOrder(order_id).subscribe(data => {
      this.selectedModel = data;
      // start refreshing offers if order is open
      if (!this.timerSubscr && this.selectedModel.status == 'open') {
        this.subscribeAutoRefreshOffers();
      }
      if (this.selectedModel.id) {
        //round distance number          
        if (this.selectedModel.distance > 10000)
          this.selectedModel.distance = Math.floor(this.selectedModel.distance);
        else
          this.selectedModel.distance = Math.round((this.selectedModel.distance) * 100) / 100;

        //get category name
        this.categoryService.getCategory(+this.selectedModel.category_id).subscribe(data => this.categoryModel = data);

        //get currency name
        this.currencyService.getCurrency(+this.selectedModel.currency_id).subscribe(data => this.currencyModel = data);

        //get parcels
        this.parcel_total_weight = 0;
        this.parcelService.getParcels(+this.selectedModel.id).subscribe(data => {
          this.parcels = data;
          this.parcels.forEach(val => {
            //get total weight of all parcels
            this.parcel_total_weight += +val.weight;
          })
        });

        //get attachments
        this.orderAttachmentsService.getAttachments(this.selectedModel.id).subscribe(data => this.orderAttachmentsModel = data);

        //get offers
        this.getOffers();


        //get order time
        this.orderTimeService.get(this.selectedModel.id).subscribe(data => {
          this.orderTimeModel = data;
          Object.keys(this.orderTimeModel).forEach((el) => {
            if (this.orderTimeModel[el] && el !== 'id_order')
              this.orderTimeModel[el] = this.orderTimeModel[el].substring(0, this.orderTimeModel[el].length - 3);
          });
        });


        //get user info
        this.orderService.getUserByOrderId(this.selectedModel.id).subscribe(data => {
          this.orderUserModel = data;
          //get payment
          this.paymentTypesService.get(this.selectedModel.payment_type_id).subscribe(data => {
            this.paymentTypesModel = data
            this.working = false;
          });
        });
      }
    });
  }

  checkTimeOfEditOffer() {
    this.orderService.getDateModified(this.selectedModel.id).subscribe(data => {
      if (this.selectedModel.date_modified != data.date_modified)
        this.orderUpdated = true;
      if (this.orderUpdated) {
        this.loadOrder();
      }
      else if (this.selectedModel.status == 'open')
        this.getOffers();
    });
  }

  onOfferSelected(offer: OrderOfferModel) {
    // if we dont want to reaload offer and order from the server we need to 
    // re-assign status manually
    this.selectedModel.status = "awaiting";
    this.wonOrderOfferModel = offer;
    this.bestOrderOfferModel = null;
    this.orderOfferModel = null;
    this.yourOrderOfferModel = null;
  }

  onOfferChange(result: OrderOfferModel) {
    //offer placed, we dont need to show offer box
    this.showOfferBox = false;
    this.getOffers();
    this.subscribeAutoRefreshOffers();
  }

  isOwner() {
    if (!this.selectedModel)
      return false;

    let ownerId: number;
    if (this.systemMode.is_trustee && this.selectedModel.trustee_id)
      ownerId = this.selectedModel.trustee_id;
    else
      ownerId = this.selectedModel.user_id;

    return Helpers.isIdUserId(ownerId);
  }

  getOffers() {
    //get offers
    if (!this.selectedModel)
      return;
    console.log('getting offers')
    if (this.selectedModel.status == 'awaiting' || this.selectedModel.status == 'compleated') {
      this.orderOfferService.getWonOffer(this.selectedModel.id).subscribe(data => {
        this.wonOrderOfferModel = data;
        this.bestOrderOfferModel = null;
        this.orderOfferModel = null;
        this.yourOrderOfferModel = null;
      })
    } else
      this.orderOfferService.get(this.selectedModel.id).subscribe(data => {
        console.log('got offers', data.length);

        this.orderOfferModel = data;
        console.log(this.orderOfferModel)
        if (this.orderOfferModel.length > 0) {
          console.log('check offer if yourOffer');

          this.bestOrderOfferModel = this.orderOfferModel[0];
          if (Helpers.isOfferOwner(this.bestOrderOfferModel.company_user_id))
            this.yourOrderOfferModel = this.bestOrderOfferModel;
            console.log(this.yourOrderOfferModel)
          this.orderOfferModel.splice(0, 1);
        }

        if (!this.yourOrderOfferModel && this.orderOfferModel.length > 0)
          for (let i = 0; i < this.orderOfferModel.length; i++) {
            if (Helpers.isOfferOwner(this.orderOfferModel[i].company_user_id)) {
              console.log('is offer owner');
              this.yourOrderOfferModel = this.orderOfferModel[i];
              this.orderOfferModel.splice(i, 1);
              break;
            }
          }
        //if company has not any offer than set open offer box.
        if (!this.yourOrderOfferModel)
          this.showOfferBox = true;
      });
  }

  onEditOfferClick(b: any) {
    if (this.timerSubscr)
      this.timerSubscr.unsubscribe()
    this.showOfferBox = b;
  }
  ngOnDestroy() {
    if (this.timerSubscr)
      this.timerSubscr.unsubscribe();
  }

  getCategoryIcon(id: number) {
    return Helpers.getCategoryIcon(id);
  }

  ngOnInit() {
    this.working = true;

    this.messageService.translate(new Messages()).subscribe(data => {
      this.messages = data;
      this.route.params.subscribe(params => {
        let oid: number = +params['id'];
        this.loadOrder(oid);
      });
    });
  }

  toggleShowParcels() {
    this.showParcels = !this.showParcels;
  }

  toggleShowAttachments() {
    this.showAttachments = !this.showAttachments;
  }

  toggleShowDates() {
    this.showDates = !this.showDates;
  }

  getFlagUrl(f: string) {
    return Helpers.getFlagUrl(f);
  }

  getFileIcon(name: string): string {
    return Helpers.getFileIconCssByFileName(name);
  }
}

class Messages {
  added = "Added";
  customer = "Customer";
  payment_type_and_currency = "Payment Type And Currency"
  distance = "Distance";
  route = "Route";
  parcels = "Parcels";
  attachments = "Attachments";
  date_of_getting = "Date Of Picking"
  date_of_delivery = "Date of Delivery";
  hours_of_delivery = "Hours of Delivery";
  hours_of_getting = "Hours Of Picking";
  dates = "Dates";
  weight = "Weight";
  total_weight = "Total Weight";
  sizes = 'Sizes';
  tel = "Telephone";
  email = "E-mail";
  message = "Message";
  start_confersation = "Start Conversation";
  best_offer = "Best Offer";
  your_offer = "Your Offer";
  other_offers = "Other Offers";
  won_offer = "Offer Selected";
  no_offers_yet = "This order has no any offer yet";
  order_cancelled = "This order has been cancelled";
  offer_compleated = "Offer compleated";
  offer_out = 'Order is closed for offers';
  order_updated = '! User has just updated that order';
  go_back = "Go Back";
  execution_dates = "Execution Dates";
  more_details = "More Details";
  less_details = "Less Details";
}