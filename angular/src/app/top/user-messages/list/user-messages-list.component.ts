import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserMessageModel } from '../user-message.model';
import { UserMessageService } from '../user-message.service';
import { MessagesService } from '../../../messages/messages.service';
import { SystemMode } from '../../system-mode';
import { Subscription } from 'rxjs/Rx';
import { AgoDateFormatMessagesModel } from '../../../ago-date-format/ago-date-format-messages.model';
import { Router, ActivatedRoute } from '@angular/router';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-user-messages-list',
  templateUrl: './user-messages-list.component.html',
  styleUrls: ['./user-messages-list.component.css']
})
export class UserMessagesListComponent implements OnInit, OnDestroy {
  working             = true;
  showDeleteDialog    = false;
  messageModel        : UserMessageModel[];
  orginalMessageModel : UserMessageModel[];

  messages            : Messages;
  messageToDelete     : UserMessageModel;
  systemMode          = new SystemMode();
  agoComponentMessages: AgoDateFormatMessagesModel;

  // Subscription object
  timerSubscr: Subscription;
  listOrderSubscr: Subscription;

  constructor(private userMessageService:UserMessageService, private messagesService:MessagesService, private router:Router, private route:ActivatedRoute) { }
  
  getIconColor(b:boolean){
    if (!b)
      return '#fff';
    else
      return '#2d5ee7';
  }

  ngOnDestroy(){
    if (this.timerSubscr)
      this.timerSubscr.unsubscribe();
  }
  
  messageClick(oid:number, uid:number, token:string){
    this.router.navigate(['../view'], {queryParams: {oid:oid, uid:uid, token:token}, relativeTo:this.route});
  }

  loadListOfMessages(){
    if (this.listOrderSubscr)
      this.listOrderSubscr.unsubscribe();
    this.listOrderSubscr = this.userMessageService.getList(this.systemMode.is_company).subscribe(data=>{
      let compare: UserMessageModel[] = data;
      if (this.messageModel!==compare)
      this.messageModel = compare;
      this.orginalMessageModel = compare;
      this.working = false;      
    });
  }
  onDeleteConfirmation(status:any){
    console.log(status);    
    if (status){
      this.userMessageService.delete(this.messageToDelete.token, this.messageToDelete.id, this.systemMode.is_company).subscribe(data=>{
        console.log(data);
        this.showDeleteDialog = false;
        this.loadListOfMessages();
      });  
    }
    else
      this.showDeleteDialog = false;
  }
  deleteClick(msg: UserMessageModel){
    this.messageToDelete = msg;
    this.showDeleteDialog = true;
  }
  
  searchBoxChange(text:string){
    text = text.toLocaleLowerCase();
    console.log(text);
    

    if (text.length==0){
      this.messageModel = this.orginalMessageModel;
      return;
    }
    this.messageModel = [];
    

    this.orginalMessageModel.forEach(val=>{
      if ((val.company_name && val.company_name.indexOf(text)>=0) 
        || (val.name && val.name.toLocaleLowerCase().indexOf(text)>=0) 
        || (val.surname && val.surname.toLocaleLowerCase().indexOf(text)>=0) 
        || (val.title && val.title.toLocaleLowerCase().indexOf(text)>=0))
      this.messageModel.push(val);
    })
  }

  ngOnInit() {
    this.working =true;
    this.messagesService.translate(new Messages()).subscribe(data=>{
      this.messagesService.translate(new AgoDateFormatMessagesModel()).subscribe(data=>this.agoComponentMessages = data);
      this.messages=data;

      this.timerSubscr = TimerObservable.create(0, 10000).subscribe(() => this.loadListOfMessages());
      
    })
  }

}
class Messages{
  result_not_found = "Results not found.";
  search = "Search";
}