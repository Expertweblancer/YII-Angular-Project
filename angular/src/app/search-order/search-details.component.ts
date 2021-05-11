import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MessagesService } from '../messages/messages.service';
import { MessageDefinitions } from '../messages/message-definitions';
import { AddressModel } from '../google-maps/address.model';
import { Helpers } from '../tools/helpers';

@Component({
  selector: 'search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent implements OnInit {
  total_distance:number;
  messages = new Messages;
  @Input() fromAddress:AddressModel;
  @Input() toAddress:AddressModel;
  @Input() distance:number;
  @Output() onSubmit = new EventEmitter<number>();

  constructor(private messagesService:MessagesService) { 
  }
  searchClick(total_km:number){
    this.onSubmit.emit(total_km);
  }
  ngOnInit() {
        let offset = 10;
        if (this.distance > 100)
          offset = 50; 
        else
          if (this.distance > 1000)
            offset = 100;
        this.total_distance = Math.ceil(this.distance * 120/100 / 10) * 10; 
        this.messagesService.translate(this.messages)
          .subscribe(data=>this.messages = data, error=>console.log('getting translation error: '+error), ()=>console.log('getting message finish'));
  }
  getFlagUrl(url:string):string{
    return Helpers.getFlagUrl(url);
  } 

}
class Messages{
  delivery_from     = MessageDefinitions.delivery_from;
  delivery_to       = MessageDefinitions.delivery_to;
  search_details    = "Search Details";
  starting_point    = "Starting Point";
  finish_point      = "Finish Point";
  order_details     = MessageDefinitions.order_details;
  from_address      = MessageDefinitions.from_address;
  distance          = "Distance";
  search            = "Search Orders";
  total_distance    = "Total Distance";
  km_info           = "Enter max number of kilometers you are ready to drive";
}