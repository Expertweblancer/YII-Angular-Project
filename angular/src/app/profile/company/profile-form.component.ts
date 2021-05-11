import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { ProfileService } from './profile.service';
import { CompanyProfileModel } from './company-profile.model';
import { MessagesModel } from './profile-messages.model';
import { Location } from '@angular/common';
import { AddressModel } from '../address/address.model';
import { AddressService } from '../address/address.service';
import { CountryModel } from '../country/country.model';
import { CurrencyModel } from '../../common/currency.model';
import { CurrencyService } from '../../common/currency.service';
import { CountryService } from '../country/country.service';
import { MessagesService } from '../../messages/messages.service';
import { ProfileUserModel } from '../user/profile-user.model';
import { SecurityService } from '../../security/security.service';
import { AppChangeService } from '../../app-change.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PasswordValidator } from '../user/password.validator';
import { Helpers } from '../../tools/helpers';
import { Patterns } from '../../tools/patterns';

class EmitModel{
  model:CompanyProfileModel;
  state:string;
}

@Component({
  selector:'profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {
  model:CompanyProfileModel;
  currencies: CurrencyModel[];
  profileUserModel = new ProfileUserModel();
  readonly = true;
  addressModel = new AddressModel();
  showErrorMsg = false;
  working=false;
  editModel=false;
  messages : MessagesModel;
  profileForm:FormGroup;


  constructor(private profileService:ProfileService, 
              private location:Location,
              private securityService:SecurityService,
              private addressService:AddressService,
              private currencyService: CurrencyService, 
              private msgSrvc: MessagesService,
              private fb:FormBuilder,
              private acs:AppChangeService) {
    this.profileForm = this.fb.group({
      user: this.fb.group({
        email:[{value:null, disabled:true}],
        username:[{value:null, disabled:true}],
        password:[],
        password_retype:[],
      }, {
        validator: PasswordValidator.MatchPassword
      }),
      profile: this.fb.group({
        name:[null, [Validators.required,  Validators.pattern(Patterns.nameRegex)]],
        contact_person:[],
        tel:[null, [Validators.required,  Validators.pattern(Patterns.phoneRegex)]],
        currency_id:[null, [Validators.required]],
        no_vat:[null, [Validators.required, Validators.pattern(Patterns.nameRegex)]],
        description:[],
        id:[],
        foto:[],
        id_address:[],
      }),
      address:this.fb.group({
        address1:[null, [Validators.required,  Validators.pattern(Patterns.nameRegex)]],
        address2:[],
        postal:[null, [Validators.required, Validators.pattern(Patterns.postalRegex)]],
        city:[null, [Validators.required,  Validators.pattern(Patterns.nameRegex)]],
        id_country:[null, [Validators.required]],
        description:[],
        id:[],
      })
    });
  }
  
  ngOnInit() {
    this.working=true;
    this.msgSrvc.translate(new MessagesModel()).subscribe(data=>{
        this.messages = data
      //load currencies
        this.currencyService.getList().subscribe(data=>{
            this.currencies = data;
            this.profileService.get().subscribe(profile=>{
              console.log(profile);
              this.profileForm.patchValue({profile:profile});
              this.securityService.getProfileUser().subscribe(data=>{
                this.profileUserModel = data;
                this.profileForm.patchValue({user:data});
              }, err=>{
                this.working = false;
                this.acs.emitChange(this.acs.events.srv_error+JSON.stringify(err));
              })
              this.model = profile;
              if (this.model.id_address)
                this.addressService.get(this.model.id_address).subscribe(data=>{
                  this.addressModel = data;
                  console.log(this.addressModel);
                  this.profileForm.patchValue({address:data});
                }, err=>{
                  this.working = false;
                  this.acs.emitChange(this.acs.events.srv_error+JSON.stringify(err));
                });
              this.working = false;
            } , err=>{
              this.working = false;
              this.acs.emitChange(this.acs.events.srv_error+JSON.stringify(err));
            });
      


        }, err=>{
            this.working = false;
            this.acs.emitChange(this.acs.events.srv_error+JSON.stringify(err));
        });
      });
    
  }

  onSubmit(){
      if (!this.profileForm.valid){
        console.log('form invalid');
        this.showErrorMsg = true;
        Helpers.markAsTouched(this.profileForm);      
        return;
      }
      this.working = true;
      let formRawData = this.profileForm.getRawValue();
      console.log(formRawData);
     
      if (formRawData.user.password && formRawData.user.password.length>0)
        this.securityService.updatePassword(formRawData.user.password).subscribe(data=>console.log('password changed'), err=>{
          console.log('saving password');
          this.working = false;
          this.acs.emitChange(this.acs.events.srv_error+JSON.stringify(err));
        });
      console.log('saving address');
      this.addressModel = formRawData.address;
      console.log(this.addressModel);
      this.addressService.save(this.addressModel).subscribe(data=>{
        this.addressModel = data;

        this.model = formRawData.profile;        
        this.model.id_address = this.addressModel.id;
        console.log('saving profile');
        console.log(this.model);
        
        this.profileService.save(this.model).subscribe(data=>{
          this.working = false;
          this.acs.emitChange(this.acs.events.reload_profile);
          this.location.back();
        }, err=>{
          this.working = false;
          this.acs.emitChange(this.acs.events.srv_error+JSON.stringify(err));
        }, ()=>this.working=false)
      }, err=>{
        this.working = false;
        this.acs.emitChange(this.acs.events.srv_error+JSON.stringify(err));
      });
  }

  fotoUploaded(event){
    (this.profileForm.controls['profile'] as FormGroup).patchValue({foto: event[0]});
  }
 
  addressChanged(data:AddressModel){
    this.addressModel = data;
  }

  cancelEdit(){
    this.location.back();
  }
}