import { Component, OnInit } from '@angular/core';
import { AddressModel } from '../address/address.model';
import { CustomerProfileModel } from './customer-profile.model';
import { CustomerProfileService } from './customer-profile.service';
import { AddressService } from '../address/address.service';
import { CurrencyService } from '../../common/currency.service';
import { MessagesService } from '../../messages/messages.service';
import { ProfileUserModel } from '../user/profile-user.model';
import { CurrencyModel } from '../../common/currency.model';
import { Location } from '@angular/common';
import { SecurityService } from '../../security/security.service';
import { AppChangeService } from '../../app-change.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PasswordValidator } from '../user/password.validator';
import { Patterns } from '../../tools/patterns';


@Component({
  selector: 'app-customer-profile-form',
  templateUrl: './customer-profile-form.component.html'
})
export class CustomerProfileFormComponent implements OnInit {
  model = new CustomerProfileModel();
  currencies: CurrencyModel[];
  photo: string;
  profileUserModel = new ProfileUserModel();
  readonly = true; //this is to user component to disable username and password edit
  addressModel = new AddressModel();
  showErrorMsg = false;
  working = false;
  editModel = false;
  messages: Messages;
  profileForm: FormGroup;
  constructor(private profileService: CustomerProfileService,
    private location: Location,
    private securityService: SecurityService,
    private addressService: AddressService,
    private currencyService: CurrencyService,
    private msgSrvc: MessagesService,
    private fb: FormBuilder,
    private acs: AppChangeService, ) {
    this.profileForm = this.fb.group({
      user: this.fb.group({
        email: [{value:null, disabled:true}],
        username: [{value:null, disabled:true}],
        password: [],
        password_retype: [],
      }, {
          validator: PasswordValidator.MatchPassword
        }),
      profile: this.fb.group({
        name: [null, [Validators.required, Validators.pattern(Patterns.nameRegex)]],
        surname: [null, [Validators.required, Validators.pattern(Patterns.nameRegex)]],
        phone_num: [null, [Validators.required, Validators.pattern(Patterns.phoneRegex)]],
        id_currency: [null, [Validators.required]],
      }),
      address: this.fb.group({
        address1: [null, [Validators.required]],
        address2: [],
        postal: [null, [Validators.required, Validators.pattern(Patterns.postalRegex)]],
        city: [null, [Validators.required, Validators.pattern(Patterns.nameRegex)]],
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
        this.securityService.getProfileUser().subscribe(data => {
          this.profileUserModel = data;
          this.profileForm.patchValue({ user: data });


          this.profileService.get().subscribe(profile => {
            console.log(profile);
            if (profile == [])
              this.model = new CustomerProfileModel;
            else {
              this.profileForm.patchValue({ profile: profile });

              this.model = profile;
              this.model.updateModel = true;
            }
            if (this.model.id_address) {
              this.addressService.get(this.model.id_address).subscribe(data => {
                this.addressModel = data;
                console.log(data);
                this.profileForm.patchValue({ address: data });
                this.working = false;
              });
            } else
              this.working = false;
          }, err => {
            this.working = false;
            this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
          });
        });
      });
    });
  }

  onSubmit() {
    this.profileForm.markAsTouched();
    if (!this.profileForm.valid) {
      this.profileForm.markAsTouched();
      this.showErrorMsg = true;
      return;
    }
    let formRawData = this.profileForm.getRawValue();
    this.working = true;
    let addressid = this.addressModel.id;
    this.addressModel = formRawData.address;
    //set address id after wiping it of during set formRawData
    this.addressModel.id = addressid;
    this.addressService.save(this.addressModel).subscribe(data => {
      this.addressModel = data;
      this.model.name = formRawData.profile.name;
      this.model.phone_num = formRawData.profile.phone_num;
      console.log(this.model.phone_num + ' - ' + formRawData.profile.phone_num);

      this.model.id_currency = formRawData.profile.id_currency;
      this.model.surname = formRawData.profile.surname;
      this.model.id_address = this.addressModel.id;
      this.model.foto = this.photo;
      if (formRawData.user.password && formRawData.user.password.length > 0)
        this.securityService.updatePassword(formRawData.user.password).subscribe(data => console.log(data));

      this.profileService.set(this.model).subscribe(data => {
        console.log(this.model);
        this.acs.emitChange(this.acs.events.reload_profile);
        this.working = false;
        this.location.back();
      }, err => {
        this.working = false;
        this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
      })
    }, err => {
      this.working = false;
      this.acs.emitChange(this.acs.events.srv_error + JSON.stringify(err));
    });
  }

  fotoUploaded(event) {
    this.photo = event[0];
  }

  cancelEdit() {
    this.location.back();
  }
}



class Messages {
  name = "Name";
  surname = "Surname";
  telephone = "Telephone";
  currency = "Currency";
  save = "Save";
  cancel = "Cancel";
  fix_errors = "Your form has errors";
  phone_invalid = "Only digits are allowed";
  field_invalid = "Value is invalid";
}