import { Component, OnInit } from '@angular/core';
import { SearchResultModel } from './search-result/search-result.model';
import { DashboardTrusteeSearchService } from './dashboard-search.service';
import { InfoBoxModel } from '../../top/info-box.model';
import { MessagesService } from '../../messages/messages.service';
import { MiscService } from '../../top/misc.service';

@Component({
  selector: 'app-dashboard-trustee',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardTrusteeComponent implements OnInit {
  loading = false;
  working = false;
  messages:Messages;
  constructor( private dashboardTrusteeSearchService:DashboardTrusteeSearchService, 
               private miscService:MiscService,
               private messagesService:MessagesService) { }
  searchStr="";
  infoBoxData:InfoBoxModel;
  fun;
  searchResult:SearchResultModel;
  ngOnInit() {
    this.working = true;
    this.miscService.getTrusteeInfoBox().subscribe(msgs=>{
      this.messagesService.translate(new Messages).subscribe(data=>{
        this.messages = data;
        this.working = false;
      });
      this.infoBoxData = msgs;
    });
  }

  textChanged(text:string){
    console.log(text);
    
    if (this.searchStr==''){
        this.searchResult = null;
        return;
    }
    
    this.loading = true;
    if (this.fun)
      this.fun.unsubscribe();

    this.fun = this.dashboardTrusteeSearchService.search(text).subscribe(data=>{
      console.log('search result model')
      console.log(data);
      this.loading = false;
      this.searchResult = data;
    });
  }

}
class Messages{
  search ="Search"
  orders = "Orders";
  active = "Active";
  realized = "Realized";
  orders_realizing = "Currently Processed Orders"
}