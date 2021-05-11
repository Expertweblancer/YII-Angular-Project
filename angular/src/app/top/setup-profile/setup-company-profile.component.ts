import { Component, OnInit } from '@angular/core';
import { CurrencyModel } from '../../common/currency.model';
import { SecurityService } from '../../security/security.service';
import { CurrencyService } from '../../common/currency.service';
import { MessagesService } from '../../messages/messages.service';
import { CompanyProfileModel } from '../../profile/company/company-profile.model';
import { MessagesModel } from '../../profile/company/profile-messages.model';
import { AddressModel } from '../../profile/address/address.model';
import { ProfileService } from '../../profile/company/profile.service';
import { AddressService } from '../../profile/address/address.service';
import { Security } from '../../tools/security';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Patterns } from '../../tools/patterns';

@Component({
  selector: 'setup-company-profile',
  templateUrl: './setup-company-profile.component.html',
  styleUrls: ['./setup.css']
})
export class SetupCompanyProfileComponent implements OnInit {

  model = new CompanyProfileModel;
  currencies: CurrencyModel[];
  profileForm:FormGroup;
  showErrorMsg=false;
  readonly = false;
  addressModel = new AddressModel();

  working=false;
  messages : MessagesModel;

  constructor(private profileService:ProfileService, 
              private securityService:SecurityService,
              private addressService:AddressService,
              private currencyService: CurrencyService,
              private router:Router,
              private fb:FormBuilder, 
              private msgSrvc: MessagesService) {
                this.profileForm = this.fb.group({
                  profile: this.fb.group({
                    name:[null, [Validators.required,   Validators.pattern(Patterns.nameRegex)]],
                    contact_person:[],
                    tel:[null, [Validators.required, Validators.pattern(Patterns.phoneRegex)]],
                    currency_id:[null, [Validators.required]],
                    no_vat:[null, [Validators.required, Validators.pattern(Patterns.phoneRegex)]],
                    description:[]
                  }),
                  address:this.fb.group({
                    address1:[null, [Validators.required, Validators.pattern(Patterns.nameRegex)]],
                    address2:[],
                    postal:[null, [Validators.required, Validators.pattern(Patterns.postalRegex)]],
                    city:[null, [Validators.required, Validators.pattern(Patterns.nameRegex)]],
                    id_country:[null, [Validators.required]],
                    description:[]
                  })
                });
              }
  ngOnInit() {
    this.working=true;
    this.msgSrvc.translate(new MessagesModel()).subscribe(data=>this.messages = data);      
      //load currencies
      this.currencyService.getList().subscribe(data=>{
        this.currencies = data;
        this.working = false;
      }
    );
  }
  onSubmit(){
    this.profileForm.markAsTouched();
    if (!this.profileForm.valid)
    return;

    this.working = true;
    let formRawData = this.profileForm.getRawValue();
    this.addressModel = formRawData.address;
    this.addressService.save(this.addressModel).subscribe(data=>{
      this.addressModel = data;
      let tempFoto = this.model.foto;
      this.model = formRawData.profile;
      this.model.foto = tempFoto;
      this.model.id_address=this.addressModel.id;
      this.profileService.save(this.model).subscribe(data=>{
        this.securityService.getUserInfo().subscribe(data=>{
          this.working = false;
          Security.setUserInfoCookies(data);
          this.router.navigate(['/company']);
        });
      }, err=>{     
          this.working = false;
          console.log(err);
      }, ()=>this.working=false)
    });
  }

  fotoUploaded(event){
    this.model.foto = event[0];
  }
 
  addressChanged(data:AddressModel){
    this.addressModel = data;
  }
}
