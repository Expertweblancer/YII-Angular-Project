import { Component, OnInit, transition, OnDestroy } from '@angular/core';
import { MessagesService } from '../../../messages/messages.service';
import { UserMessageService } from '../user-message.service';
import { SystemMode } from '../../system-mode';
import { AppChangeService } from '../../../app-change.service';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
@Component({
  selector: 'user-messages-menu',
  templateUrl: './user-messages-menu.component.html',
  styleUrls: ['./user-messages-menu.component.css']
})



export class UserMessagesMenuComponent implements OnInit, OnDestroy {
  messages:Messages;
  numOfUnread:number;
  systemMode = new SystemMode();
  ticks = 0;
  // Subscription object
  private timerSubscr: Subscription;
  constructor(private messagesService:MessagesService, private userMessageService:UserMessageService, private acs: AppChangeService) { }
  
  loadNumOfUnreadMessages(){
    this.userMessageService.getNumUnread(this.systemMode.is_company).subscribe(data=>{
      this.numOfUnread = data.num;    
    }, err=>console.log(err)
    );
  }

  ngOnDestroy(){
    this.timerSubscr.unsubscribe();
  }

  ngOnInit() {
    this.timerSubscr = TimerObservable.create(0, 5000).subscribe(() => this.loadNumOfUnreadMessages());  
    
    this.acs.changeEmitted$.subscribe(
      event => {
        switch (event){
        case this.acs.events.num_msgs_read: {
          if (this.timerSubscr)
            this.timerSubscr.unsubscribe()
          this.loadNumOfUnreadMessages();
        }
      }
    });

    this.messagesService.translate(new Messages).subscribe(data=>this.messages = data);
  }

}
class Messages{
  messages = "Messages";
}