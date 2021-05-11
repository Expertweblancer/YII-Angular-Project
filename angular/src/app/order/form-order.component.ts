import { Component, OnInit, EventEmitter, Output, NgZone, ViewChild, Input, AfterViewInit } from '@angular/core';
import { OrderModel } from './order.model';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from './order.service';
import { CategoryModel } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { MessageDefinitions } from '../messages/message-definitions';
import { Helpers } from '../tools/helpers';
import { AppDefinitions } from '../definitions';
import { GoogleMapsComponent } from '../google-maps/google-maps.component';
import { Location } from '@angular/common';
import { AddressModel } from '../google-maps/address.model';
import { DirectionsModel } from '../google-maps/directions.model';
import { Cookie } from '../tools/cookie';
import { PaymentTypesModel } from '../common/payment-types.model';
import { PaymentTypesService } from '../common/payment-types.service';
import { CurrencyModel } from '../common/currency.model';
import { CurrencyService } from '../common/currency.service';
import { MessagesService } from '../messages/messages.service';
import { OrderAttachmentsModel } from './other/order-attachments.model';
import { OrderAttachmentsService } from './other/order-attachments.service';
import { OrderTimeModel } from './other/order-time.model';
import { OrderTimeService } from './other/order-time.service';
import { ParcelModel } from './parcel/parcel.model';
import { ParcelService } from './parcel/parcel.service';
import { AppChangeService } from '../app-change.service';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, Validator, ValidatorFn } from '@angular/forms';
import { log } from 'util';


declare var google: any;
declare var $: any;
@Component({
  selector: 'form-order',
  templateUrl: './form-order.component.html',
  styleUrls: ['./form-order.component.css'],
})
export class FormOrderComponent implements OnInit, AfterViewInit {
  @Output() onAdded = new EventEmitter<number>();
  @ViewChild('deliveryDateInput') deliveryDateInput: any; 
  @ViewChild('sendingDateInput') sendingDateInput: any; 

  @ViewChild(GoogleMapsComponent)
  private googleMapsComponent: GoogleMapsComponent;

  saving = 0;
  working = false;
  parcelsError = false;
  fileSending = false;
  modelReady = false;
  sendingDateMin:Date;
  deliveryDateMin:Date;
  sendingDateVal:string;
  deliveryDateVal:string;
  /*if done by trustee */
  orderForUser = null;

  messages = new Messages();
  model = new OrderModel();
  uploadUrl = Helpers.getBackendUrl() + 'misc/upload-image';
  constSendingHours = true;
  constDeliveryHours = true;
  orderForm: FormGroup;
  categoryModel: CategoryModel[];

  uploaderHeader = 'Bearer ' + Cookie.getCookie(AppDefinitions.authKeyCookieName);
  paymentTypes: PaymentTypesModel[];
  showDeleteConfirmationDialog = false;
  currencies: CurrencyModel[];


  routeNotFoundErr = false;
  /* constructor */
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private paymentTypeService: PaymentTypesService,
    private currencyService: CurrencyService,
    private messageService: MessagesService,
    private attachmentsService: OrderAttachmentsService,
    private orderTimeService: OrderTimeService,
    private parcelService: ParcelService,
    private acs: AppChangeService,
    private fb: FormBuilder
  ) {
    var todayDate = new Date();
    var month = (todayDate.getMonth() + 1) > 9 ? (todayDate.getMonth() + 1) : '0' + (todayDate.getMonth() + 1);
    var day = todayDate.getDate() > 9 ? todayDate.getDate() : '0' + todayDate.getDate();

    let today = todayDate.getFullYear() + '-' + month + '-' + day;
    this.sendingDateMin = new Date();
    this.deliveryDateMin = new Date();
    // if model will be loaded it will be automatically changed to false
    this.model.isNewModel = true;

    var nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60);
    var nextWeekMonth = (nextWeek.getMonth() + 1) > 9 ? (nextWeek.getMonth() + 1) : '0' + (nextWeek.getMonth() + 1);
    var nextWeekDay = nextWeek.getDate() > 9 ? nextWeek.getDate() : '0' + nextWeek.getDate();
    this.model.date_to = nextWeek.getFullYear() + '-' + nextWeekMonth + '-' + nextWeekDay;

    this.orderForm = this.fb.group({
      id: [],
      isNewModel: [],
      title: [null, Validators.required],
      info: [],
      category_id: [null, Validators.required],
      from_city: [null, Validators.required],
      from_address: [null, Validators.required],
      from_country_short: [null, Validators.required],
      from_lat: [null, Validators.required],
      from_long: [null, Validators.required],
      date_from: [today, Validators.required],
      date_to: [today, Validators.required],
      to_city: [null, Validators.required],
      to_address: [null, Validators.required],
      to_country_short: [null, Validators.required],
      to_lat: [null, Validators.required],
      to_long: [null, Validators.required],
      payment_type_id: [null, Validators.required],
      currency_id: [null, Validators.required],
      distance: [null, Validators.required],
      parcels: this.fb.array([this.newParcel()]),
      attachments: this.fb.array([this.newAttachment()]),
      time: this.fb.group({
        id: [],
        id_order: [],
        delivery_since_1: ['08:00', Validators.required],
        delivery_since_2: [],
        delivery_since_3: [],
        delivery_until_1: ['20:00', Validators.required],
        delivery_until_2: [],
        delivery_until_3: [],
        sending_since_1: ['08:00', Validators.required],
        sending_since_2: [],
        sending_since_3: [],
        sending_until_1: ['20:00', Validators.required],
        sending_until_2: [],
        sending_until_3: [],
      }),
      trustee_id: [],
    }, {
        validator: this.customValidator

      });
  }

  onDateInputOpen(){
    console.log('set date min')
    this.deliveryDateInput.setMinDate(new Date());
  }

  customValidator(AC: AbstractControl) {
    let from = AC.get('from_address');
    let to = AC.get('to_address');
    if (from == to) {
      AC.get('to_address').setErrors({ addrTheSameErr: true });
      console.log('from is the same as to');
    }

    let dateFrom = new Date(AC.get('date_from').value).getTime(); // to get value in input tag
    let dateTo = new Date(AC.get('date_to').value).getTime(); // to get value in input tag

    if (!dateFrom && !dateTo)
      return;
    var hours24 = 1000 * 60 * 60 * 24;
    var years3 = 1000 * 60 * 60 * 24 * 365 * 3;
    var now = new Date().getTime();
    let sendingDateMax = now + years3;

    if (dateFrom < now - hours24)
      AC.get('date_from').setErrors({ cantBeEarlierThanToday: true })

    if (dateFrom > sendingDateMax)
      AC.get('date_from').setErrors({ yearTooFar: true })

    if (dateTo > (dateFrom + years3)) {
      AC.get('date_to').setErrors({ yearTooFar: true })
    }

    if (dateFrom > dateTo) {
      AC.get('date_to').setErrors({ invalidDate: true })
    }
  }

  dateFromChange(data: any) {
    let val = Helpers.formatDate(data.args.newValue);
    this.deliveryDateInput.setMinDate(data.args.newValue);

    this.orderForm.patchValue({ date_from: (val) });
  }

  dateToChange(data: any) {
    let val = data.args.newValue;
    this.orderForm.patchValue({ date_to: Helpers.formatDate(val) });    
  }

  getIconCode(id: string) {
    return Helpers.getCategoryIconCode(id);
  }
  
  ngAfterViewInit():void {
  }

  ngOnInit(): void {
    this.working = true;
    this.messageService.translate(this.messages).subscribe(data => {
      this.messages = data;
    });

    // this is workaround to remove that empty element in the beginning of attachments array
    (this.orderForm.get('attachments') as FormArray).removeAt(0);
    //load payment types
    this.paymentTypeService.getList().subscribe(data => {
      this.paymentTypes = data;
    }, err => {
      this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
    });

    //load currencies
    this.currencyService.getList().subscribe(data => {
      this.currencies = data;

      //load categories;
      this.categoryService.getCategories().subscribe(data => {
        this.categoryModel = data;
        this.activatedRoute.params.subscribe(params => {
          this.orderForUser = params['uid'];

          // if id than model is edited
          if (params['id'] && params['id'] != 'new') {
            this.orderService.getOrder(params['id']).subscribe(data => {
              this.model = data;
              this.orderForm.patchValue(data);
              this.sendingDateVal = data.date_from;
              this.deliveryDateVal = data.date_to;
              if (this.model.id && this.model.id > 0) {
                this.model.isNewModel = false;
                this.attachmentsService.getAttachments(this.model.id).subscribe(data => {
                  this.model.attachments = data;

                  this.model.attachments.forEach(val => {
                    (this.orderForm.get('attachments') as FormArray).push(this.newAttachment(val));
                  })
                }, err => {
                  this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
                });
                this.orderTimeService.get(this.model.id).subscribe(data => {
                  this.model.time = data;
                  if (!this.model.time)
                    this.model.time = new OrderTimeModel();
                  else
                    this.orderForm.patchValue({ time: this.model.time })

                  this.parcelService.getParcels(this.model.id).subscribe(data => {
                    this.model.parcels = data;
                    if (this.model.parcels.length > 0) {
                      this.model.parcels.forEach(val => {
                        (this.orderForm.get('parcels') as FormArray).push(this.newParcel(val));
                      });
                      // this is workaround to remove that empty element in the beginning of parcels array
                      (this.orderForm.get('parcels') as FormArray).removeAt(0);
                    }
                    this.working = false;
                  }, err => {
                    this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
                  });
                });
              }
            }, err => {
              this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
            });
          } else
            this.working = false;
        });
      }, err => {
        this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
      });
    }, err => {
      this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
    }
    );

  }

  removeParcel(num: number) {
    (this.orderForm.get('parcels') as FormArray).removeAt(num);
  }

  addParcel() {
    (this.orderForm.get('parcels') as FormArray).push(this.newParcel());
  }

  disableSendButton() {
    this.fileSending = true;
  }

  deleteFile(num: number) {
    (this.orderForm.get('attachments') as FormArray).removeAt(num);
    this.model.attachments = (this.orderForm.controls['attachments'] as FormGroup).getRawValue();
    //    console.log(this.model.attachments);
  }

  newParcel(p: ParcelModel = null) {
    let fb = this.fb.group({
      id: [],
      order_id: [],
      width: [null, [Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")]],
      height: [null, [Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")]],
      depth: [null, [Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")]],
      weight: [null, [Validators.min(1), Validators.required, Validators.pattern("^[0-9]*$")]],
    });
    if (p)
      fb.patchValue(p);
    return fb;
  }

  newAttachment(att: OrderAttachmentsModel = null) {
    let fg = this.fb.group({
      name: [],
      id_order: [],
      id: [],
    });
    if (att)
      fg.patchValue(att);
    return fg;
  }

  onUploaded(names: any) {
    console.log(names);

    for (let i = 0; i < names.length; names++) {
      //form builder method
      let fg: FormGroup = this.newAttachment();
      fg.patchValue({ name: names[i] });
      (this.orderForm.get('attachments') as FormArray).push(fg);

      // model method
      this.model.attachments.push(new OrderAttachmentsModel(names[i]));
    }
  }

  onDirectionSet(distance: number) {
    console.log('on direction set');

    this.ngZone.run(() => {
      this.orderForm.patchValue({ distance: distance });
      if (!distance)
        this.routeNotFoundErr = true;
      else
        this.routeNotFoundErr = false;
    });
  }

  onFromPlacesChanged(address: AddressModel) {

    this.ngZone.run(() => {
      if (!address)
        address = new AddressModel();

      this.orderForm.patchValue({ from_address: address.address });
      this.orderForm.patchValue({ from_lat: address.lat });
      this.orderForm.patchValue({ from_long: address.lng });
      this.orderForm.patchValue({ from_country_short: address.country_short });
      this.orderForm.patchValue({ from_city: address.city });
    });
  }

  onToPlacesChanged(address: AddressModel) {
    this.ngZone.run(() => {
      if (!address)
        address = new AddressModel();

      this.orderForm.patchValue({ to_address: address.address });
      this.orderForm.patchValue({ to_lat: address.lat });
      this.orderForm.patchValue({ to_long: address.lng });
      this.orderForm.patchValue({ to_country_short: address.country_short });
      this.orderForm.patchValue({ to_city: address.city });
    });
  }

  decreaseSaving(n: number): number {
    let retVal = (n - 1);
    if (retVal == 0)
      this.router.navigate(['../../', this.model.id], { relativeTo: this.activatedRoute }).then((b) => { console.log(b) });
    //    console.log(n);    
    return retVal;
  }

  goBack() {
    console.log('go back!');

    this.location.back();
  }

  deleteConfirmation() {
    this.showDeleteConfirmationDialog = true;
  }

  onOrderDeleteConfirmation(decision) {
    this.showDeleteConfirmationDialog = false;
    if (!decision)
      return;
    this.working = true;

    this.orderService.cancelOrder(this.model.id).subscribe(del => {
      this.working = false;
      this.router.navigate(['../../list'], { queryParams: { action: 'open' }, relativeTo: this.activatedRoute });
    }, err => this.working = false);
  }

  onSubmit() {
    console.log(this.orderForm);
    //first check if form is valid if not make shit dirty so user see what he did wrong
    if (!this.orderForm.valid || this.routeNotFoundErr) {
      // make things dirty
      let fg = (this.orderForm.get('parcels') as FormArray);
      for (let i = 0; i < fg.length; i++)
        Helpers.markAsTouched((fg.at(i) as FormGroup));

      Helpers.markAsTouched((this.orderForm.get('time') as FormGroup));
      Helpers.markAsTouched(this.orderForm);

      return;
    }

    //form ok, disable when saving
    this.orderForm.disable();

    // create array from orderForm
    let orderFormArr = this.orderForm.getRawValue();
    //    console.log(orderFormArr);

    //set model to whatever is in orderForm as FormGroup
    this.model = orderFormArr;

    if (this.orderForUser)
      this.model.user_id = this.orderForUser;

    console.log('saving order model');


    // set number elements to save
    this.saving =
      +1 // orderModel
      + 1; // num attachments
    +1 // time 
      + 1 // delete parcels?
      + this.model.parcels.length // num of parcels

    this.orderService.set(this.model).subscribe(data => {
      //      console.log(data);
      this.saving = this.decreaseSaving(this.saving);

      if (data.id && data.id > 0) {
        this.model.id = data.id;

        //save attachments
        if (this.model.attachments && this.model.attachments.length > 0) {
          for (let i = 0; i < this.model.attachments.length; i++)
            this.model.attachments[i].id_order = this.model.id;
          this.attachmentsService.add(this.model.attachments).subscribe(data => {
            //we need to decreas number elements to save
            this.saving = this.decreaseSaving(this.saving);
          });
        } else //we need to decreas number elements to save
          this.decreaseSaving(this.saving);

        this.parcelService.deleteAll(this.model.id).subscribe(data => {
          this.saving = this.decreaseSaving(this.saving);
          this.model.parcels = orderFormArr['parcels'];

          for (let i = 0; i < this.model.parcels.length; i++) {
            this.model.parcels[i].order_id = this.model.id;
            this.parcelService.create(this.model.parcels[i]).subscribe(data => {
              //              console.log('save parcel:');
              //              console.log(data); 
              this.saving = this.decreaseSaving(this.saving);
            }, err => console.log(err));
          }
        });
        // save order time
        if (this.model.time.delivery_since_1) {
          this.model.time.id_order = this.model.id;
          this.orderTimeService.del(this.model.id).subscribe(data => {
            this.saving = this.decreaseSaving(this.saving);
            this.orderTimeService.set(this.model.time).subscribe(data => {
              this.saving = this.decreaseSaving(this.saving);
            }, err => { });
          });
        }
      }
    }, err => {
      this.acs.emitChange(this.acs.events.srv_error + err)
    });
    console.log('finish num of elements:' + this.saving)
  }
}
class Messages {
  no_orders_info = MessageDefinitions.no_orders_info;
  add_new_order = MessageDefinitions.add_new_order;
  delivery_from = MessageDefinitions.delivery_from;
  delivery_to = MessageDefinitions.delivery_to;
  date_added = MessageDefinitions.date_added;
  save = MessageDefinitions.save;
  order_details = MessageDefinitions.order_details;
  category = "Category";
  from_address = MessageDefinitions.from_address;
  sending_from = MessageDefinitions.sending_from;
  delivery_date = MessageDefinitions.delivery_date;
  sending_date = MessageDefinitions.sending_date;
  order_name = "Order Name";
  payment_type = "Payment Type";
  currency = "Currency";
  distance = 'Distance';
  time_since = "Since";
  time_until = "Until";
  sending_hours = "Sending Hours";
  delivery_hours = "Delivery Hours";
  constant = "Constant";
  customized = "Customized";
  attachments = "Attachments";
  add = "Add +";
  remarks = "Remarks";
  weight = "Weight";
  height = "Height";
  width = "Width";
  length = "Length";
  parcels = "Parcels";
  sizes = "Sizes [cm]";
  go_back = "Go Back";
  cancel = "Cancel";
  delete_order = "Cancel Order";
  discard = "Discard Changes";
  date_should_later = "Date of delivery should be later than date of sending";
  year_too_far = "Year cannot be later than in next 3 years.";
  cant_be_earlier_than_today = "Date cannot be set before today";
  basic_data = "Basic Data";
  route = "Route";
  execution_date = "Execution Date"
  since = "Since";
  until = "Until";
  route_not_found = "Route was not found or address is invalid";
  address_the_same = "Address sending and delivery cannot be the same";
  choose = "Choose..."
}