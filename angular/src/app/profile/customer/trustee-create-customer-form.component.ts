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

@Component({
  templateUrl: './customer-profile-form.component.html',
})
export class TrusteeCreateCustomerFormComponent implements OnInit {
  model = new CustomerProfileModel();
  currencies: CurrencyModel[];
  profileUserModel = new ProfileUserModel();
  showErrorMsg = false;
  addressModel = new AddressModel();
  emailExists = false;
  usernameExists = false;
  
  working=false;
  editModel=false;
  messages : Messages;

  constructor(private profileService:CustomerProfileService, 
              private location:Location,
              private securityService: SecurityService,
              private addressService:AddressService,
              private currencyService: CurrencyService, 
              private msgSrvc: MessagesService) {}

  ngOnInit() {
    this.working=true;
    this.msgSrvc.translate(new Messages()).subscribe(data=>this.messages = data);      
      //load currencies
      this.currencyService.getList().subscribe(data=>{
          this.currencies = data;
          this.working = false;
      });
  }
  onUserChange(user){
      this.profileUserModel = user;
  }
  onSubmit(){
      console.log(this.profileUserModel.canSave);
      if (!this.profileUserModel.canSave)
        return;
      this.working = true;
      this.securityService.trusteeRegister(this.profileUserModel).subscribe(data=>{
        console.log(data);
        
        if (data.status){
          this.model.user_id = data.user_id;
          this.addressService.save(this.addressModel).subscribe(data=>{
            this.addressModel = data;
            this.model.id_address=this.addressModel.id;
            console.log(this.model);
            this.profileService.set(this.model).subscribe(data=>{  
              this.securityService.setProfile(this.model.user_id, data.id).subscribe(data=>{
              this.working = false;
              this.location.back();
              })
            }, err=>{
              this.working = false;
              console.log(err);
            }, ()=>this.working=false)
          });
        }  else{
          this.working = false;
          if (data.response == 'email and username exists') {
            this.emailExists = true;
            this.usernameExists = true;
          }
          if (data.response == 'email exists')
            this.emailExists = true;
          if (data.response == 'username exists')
            this.usernameExists = true;
        }
      });

  }

  fotoUploaded(event){
    this.model.foto = event[0];
  }
 
  addressChanged(data:AddressModel){
    this.addressModel = data;
  }

  cancelEdit(){
    this.location.back();
  }
}

class Messages{
  name = "Name";
  surname = "Surname";
  telephone = "Telephone";
  currency = "Currency";
  save = "Save";
  cancel = "Cancel";
  fix_errors = "There are errors in your form";
  username_exists = "Username already exists, choosoe another one";
  email_exists = "Email already exists, choosoe another one";
}
