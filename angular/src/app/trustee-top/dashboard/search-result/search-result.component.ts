import { Component, OnInit, Input } from '@angular/core';
import { SearchResultModel } from './search-result.model';
import { MessagesService } from '../../../messages/messages.service';

@Component({
  selector: 'dashboard-trustee-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class DashboardTrusteeSearchResultComponent implements OnInit {

  constructor(private msgSrv: MessagesService) {}
  messages:Messages;

  fun:any;

  @Input() searchResult:SearchResultModel;

  ngOnInit() {
    this.msgSrv.translate(new Messages()).subscribe(data=>{
      this.messages = data;
      console.log(data);
    });
  }
}

class Messages{
  orders="Orders";
  users="Users";
  email="Email";
  name="Name";
  surname='Surname';
  username='Username';
  title='Title';
  found_no_items = "Items no found";
  companies = "Companies";
}