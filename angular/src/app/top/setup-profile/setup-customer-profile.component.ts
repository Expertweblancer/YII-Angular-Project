import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { CurrencyService } from '../../common/currency.service';
import { MessagesService } from '../../messages/messages.service';
import { CurrencyModel } from '../../common/currency.model';
import { Location } from '@angular/common';
import { SecurityService } from '../../security/security.service';
import { AddressModel } from '../../profile/address/address.model';
import { CustomerProfileModel } from '../../profile/customer/customer-profile.model';
import { CustomerProfileService } from '../../profile/customer/customer-profile.service';
import { AddressService } from '../../profile/address/address.service';
import { Security } from '../../tools/security';
import { Router } from '@angular/router';
import { AppChangeService } from '../../app-change.service';
import { Patterns } from '../../tools/patterns';

@Component({
  selector: 'setup-customer-profile',
  templateUrl: './setup-customer-profile.component.html',
  styleUrls: ['./setup.css']

})
export class SetupCustomerProfileComponent implements OnInit {

  model = new CustomerProfileModel();
  currencies: CurrencyModel[];
  profileForm: FormGroup;
  addressModel = new AddressModel();
  saving = false;
  working = true;
  editModel = false;
  messages: Messages;

  constructor(private fb: FormBuilder,
    private profileService: CustomerProfileService,
    private securityService: SecurityService,
    private addressService: AddressService,
    private currencyService: CurrencyService,
    private router: Router,
    private acs: AppChangeService,
    private msgSrvc: MessagesService) {
    this.profileForm = this.fb.group({
      profile: this.fb.group({
        name: [null, [Validators.required, Validators.pattern(Patterns.nameRegex)]],
        surname: [null, [Validators.required, Validators.pattern(Patterns.nameRegex)]],
        phone_num: [null, [Validators.required, Validators.pattern(Patterns.phoneRegex)]],
        id_currency: [null, [Validators.required]],
      }),
      address: this.fb.group({
        address1: [null, [Validators.required, Validators.pattern(Patterns.nameRegex)]],
        address2: [],
        postal: [null, [Validators.required, Validators.pattern(Patterns.postalRegex)]],
        city: [null, [Validators.required, Validators.pattern(Patterns.nameRegex  )]],
        id_country: [null, [Validators.required]],
      })
    });
  }

  ngOnInit() {
    this.working = true;
    this.msgSrvc.translate(new Messages()).subscribe(data => {
      this.messages = data;
      //load currencies
      this.currencyService.getList().subscribe(data => {
        this.currencies = data;
        this.working = false;
      }, err => {
        this.working = false;
        this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
      });
    }, err => {
      this.working = false;
      this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
    });

  }
  onSubmit() {
    this.profileForm.markAsTouched();
    if (!this.profileForm.valid) {
      return;
    }
    this.profileForm.disable();
    let formRawModel = this.profileForm.getRawValue();
    this.saving = true;


    this.addressModel = formRawModel.address;
    this.model.surname = formRawModel.profile.surname;
    this.model.phone_num = formRawModel.profile.phone_num;
    this.model.id_currency = formRawModel.profile.id_currency;
    this.model.name = formRawModel.profile.name;

    this.addressService.save(this.addressModel).subscribe(data => {
      this.addressModel = data;
      this.model.id_address = this.addressModel.id;
      this.profileService.set(this.model).subscribe(data => {
        this.securityService.getUserInfo().subscribe(data => {
          this.saving = false;
          Security.setUserInfoCookies(data);
          this.router.navigate(['/customer']);
        }, err => {
          this.saving = false;
          this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
        });
      }, err => {
        this.saving = false;
        this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
      }, () => this.saving = false)
    }, err => {
      this.saving = false;
      this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
    });
  }

  fotoUploaded(event) {
    this.model.foto = event[0];
  }

  addressChanged(data: AddressModel) {
    this.addressModel = data;
  }
}

class Messages {
  setup_customer_profile = "Setup Customer Profile"
  name = "Name";
  surname = "Surname";
  telephone = "Telephone";
  currency = "Currency";
  save = "Save";
  cancel = "Cancel";
  required = "Required";
}