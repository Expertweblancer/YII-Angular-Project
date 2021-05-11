import { Component, OnInit } from '@angular/core';
import { MessagesModel } from './profile-messages.model';
import { AddressModel } from '../address/address.model';
import { ProfileUserModel } from '../user/profile-user.model';
import { CurrencyModel } from '../../common/currency.model';
import { CompanyProfileModel } from './company-profile.model';
import { ProfileService } from './profile.service';
import { SecurityService } from '../../security/security.service';
import { AddressService } from '../address/address.service';
import { CurrencyService } from '../../common/currency.service';
import { MessagesService } from '../../messages/messages.service';
import { Location } from '@angular/common';

@Component({
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class TrusteeCreateCompanyFormComponent implements OnInit {

  model = new CompanyProfileModel;
  currencies: CurrencyModel[];
  profileUserModel = new ProfileUserModel();
  showErrorMsg=false;
  readonly = false;
  addressModel = new AddressModel();
  emailExists = false;
  usernameExists=false;
  working=false;
  editModel=false;
  messages : MessagesModel;

  constructor(private profileService:ProfileService, 
              private location:Location,
              private securityService:SecurityService,
              private addressService:AddressService,
              private currencyService: CurrencyService, 
              private msgSrvc: MessagesService) {
              }
  ngOnInit() {
    this.working=true;
    this.msgSrvc.translate(new MessagesModel()).subscribe(data=>this.messages = data);      
      //load currencies
      this.currencyService.getList().subscribe(data=>{
        this.currencies = data;
      }
    );
      this.profileService.get().subscribe(profile=>{
        this.working = false;
      });
  }
  onUserChange(){

  }
  onSubmit(){
      if (!this.profileUserModel.canSave){
        this.showErrorMsg = true;
        return;
      }
      this.working = true;
      this.securityService.trusteeRegister(this.profileUserModel).subscribe(data=>{
          console.log(data);
          if (data.status){
            this.addressService.save(this.addressModel).subscribe(data=>{
              this.addressModel = data;
              this.model.id_address=this.addressModel.id;
              this.profileService.save(this.model).subscribe(data=>{
                this.working = false;
                this.location.back();
              }, err=>{
                this.working = false;
                console.log(err);
              }, ()=>this.working=false)
            });
                  
        } else{
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
