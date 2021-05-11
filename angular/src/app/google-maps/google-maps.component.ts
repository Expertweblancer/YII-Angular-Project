import { Component, OnInit, Input, Output, EventEmitter,SimpleChange,OnChanges,AfterViewInit, NgZone } from '@angular/core';
import { AppDefinitions } from '../definitions';
import { DirectionsModel } from './directions.model';
import { OrderModel } from '../order/order.model';

declare var google:any;

@Component({
  selector: 'google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit, AfterViewInit, OnChanges  {
  @Input() height:number;
  @Input() from_address:string;
  @Input() to_address:string;
  @Input() orders:OrderModel[];
  @Input() displayMap = true;
  @Output() onDirectionSet=new EventEmitter<number>();
  
  private map:any;
  private directionsService:any;
  directionsDisplay:any;
  
  constructor(private zone:NgZone) {}


           // Start/Finish icons
  icons = {
    start: new google.maps.MarkerImage(
    // URL
      'https://app.snarto.com/assets/img/start48.png',
    // (width,height)
      new google.maps.Size( 44, 32 ),
    // The origin point (x,y)
      new google.maps.Point( 0, 0 ),
    // The anchor point (x,y)
      new google.maps.Point( 22, 32 )
    ),
    end: new google.maps.MarkerImage(
    // URL
      'https://app.snarto.com/assets/img/end48.png',
             // (width,height)
             new google.maps.Size( 44, 32 ),
             // The origin point (x,y)
             new google.maps.Point( 0, 0 ),
             // The anchor point (x,y)
             new google.maps.Point( 22, 32 )
            )
        };

  ngAfterViewInit(){}

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {   
    let changed = false;
    for (let propName in changes) {
      let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      if (cur!==prev)
        changed = true;
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    if (changed) { 
      if (this.from_address!==undefined && this.to_address!==undefined && this.from_address!=='' && this.to_address!=='')
        this.setDirection(this.from_address, this.to_address);
      if (this.orders!==undefined) {
        this.setMarkers();
      }
    } 
  }

  ngOnInit(){
     if (AppDefinitions.isOffline)
        return;
      this.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers : true});
      this.map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: 50.979571, lng: 10.314687},
          zoom: 5
      });
   }
  
  setMarkers(){
    console.log('setting markers');
    this.orders.forEach(el => {
      console.log(el);
      var myLatlng = new google.maps.LatLng(el.from_lat, el.from_long);
              
      var marker = new google.maps.Marker({
          position: myLatlng,
          title:"Mid",
          map:this.map,
      });
      google.maps.event.addListener(marker, 'click', ()=> {
        this.map.setCenter(marker.getPosition());
      });
    });
  }


  
  setDirection(origin:string, destination:string){
      if (AppDefinitions.isOffline || !origin || !destination)
        return;

      this.directionsService = new google.maps.DirectionsService();
      
      
      this.directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: 'DRIVING'
        }, (response:any, status:any) => {
            console.log(this.directionsDisplay);
            this.directionsDisplay.setMap(this.map);

            if (status === 'OK') {
              this.directionsDisplay.setDirections(response);
              var directionsModel = new DirectionsModel;
              directionsModel.distance = response.routes[0].legs[0].distance.value;
              console.log('distance:' + directionsModel.distance);
              console.log(response);
                this.onDirectionSet.emit(directionsModel.distance);
            } else {
              this.onDirectionSet.emit(null);
            }
       });
    }
}
