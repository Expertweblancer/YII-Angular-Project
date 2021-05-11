import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessagesService } from '../../messages/messages.service';
import { CountryService } from '../country/country.service';
import { CountryModel } from '../country/country.model';
import { CurrencyModel } from '../../common/currency.model';
import { AddressModel } from './address.model';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'profile-address',
  templateUrl: './profile-address.component.html',
  styleUrls: ['./profile-address.component.css']
})
export class ProfileAddressComponent implements OnInit {
  countries:CountryModel[];
  @Input() formGroup:FormGroup;
  @Input() addressModel:AddressModel;
  
  constructor(private messagesService:MessagesService, private countryService:CountryService) { }
  messages:Messages;

  ngOnInit() {
    this.messagesService.translate(new Messages()).subscribe(data=>this.messages = data);
    this.countryService.getCountries().subscribe(data=>{
      this.countries =data;
    });
  }

}
class Messages{
  address = "Address";
  address_continue = "Address (continue)"
  postal = "Postal Code";
  country = "Country";
  city = "City";
  required = "Required";
  optional = "Optional";
  field_invalid = "Value is invalid";
}