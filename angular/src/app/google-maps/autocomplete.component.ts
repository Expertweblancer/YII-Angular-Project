import { Component, OnInit, Input, NgZone, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { AddressModel } from './address.model';
import { AppDefinitions } from '../definitions';
import { Helpers } from '../tools/helpers';
import { MessagesService } from '../messages/messages.service';
declare var google: any;
@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
  @Input() cssClass: string;
  @Input() address: string;
  @Input() inputId: string;
  @Input() accurate = false;

  @Output() onPlacesChanged = new EventEmitter<AddressModel>();


  addr_valid = true;
  messages: Messages;
  addressModel = new AddressModel;
  constructor(private msgsrv: MessagesService) {
    if (this.inputId === undefined || this.inputId === '')
      this.inputId = 'i' + Helpers.getUID();
  }

  ngOnInit() {
    this.msgsrv.translate(new Messages()).subscribe(data => this.messages = data);
  }

  ngAfterViewInit() {
    this.initGoogle();
  }

  addressInputChanged(addressText) {
    this.onPlacesChanged.emit(new AddressModel());
    this.addr_valid = false;
  }

  initGoogle() {
    if (AppDefinitions.isOffline) {
      console.log('app is offline in settings, GOOGLE not working!');
      return;
    }

    let input: any = document.getElementById(this.inputId)
    let options = {
      types: [
        // return only geocoding results, rather than business results.
        'geocode',
      ],
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);

    // Add listener to the place changed event
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();

      if (place.name === "") {
        this.addressChanged(null, null, null, null, null);
        return;
      }

      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let address = place.formatted_address;
      let street: string = null;
      let city: string = null;
      let country: string = null;
      let postal: string = null;
      console.log(place.address_components);
      place.address_components.forEach(element => {
        if (element.types[0] == 'country')
          country = element.short_name;
        else
          if (!street && (element.types[0] == 'route' || element.types[0] == 'premise'))
            street = element.long_name;
          else
            if (!city && (element.types[0] == 'locality' || element.types[0] == 'postal_town' || element.types[0] == 'sublocality_level_3' 
              || element.types[0] == 'sublocality_level_2' ||element.types[0] == 'sublocality_level_1'
              || element.types[0] == 'sublocality' || element.types[0] == 'administrative_area_level_3' 
              || element.types[0] == 'administrative_area_level_2' || element.types[0] == 'administrative_area_level_1'))
              city = element.long_name;
            else
              if (element.types[0] == 'postal_code')
                postal = element.long_name;

      });
      console.log(street, postal, city);
      if (this.accurate && (!street || !postal)) {
        this.addressChanged(null, null, null, null, null);
        return;
      }
      
      this.addressChanged(lat, lng, address, city, country);
    });
  }

  addressChanged(lat: string, lng: string, address: string, city: string, country: String) {
    if (!lat) {
      this.addr_valid = false;
      this.onPlacesChanged.emit(null);
      return;
    }
    this.addr_valid = true;
    this.addressModel.lat = lat;
    this.addressModel.lng = lng;
    this.addressModel.address = address;
    this.addressModel.country_short = country.toLowerCase().toString();
    this.addressModel.city = city;
    this.onPlacesChanged.emit(this.addressModel);
  }
}
class Messages {
  invalid_value = "Address is invalid";
}