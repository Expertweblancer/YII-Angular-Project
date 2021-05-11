import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../../messages/messages.service';
import { NotificationsService } from '../notifications.service';
import { Subscription } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { AppChangeService } from '../../../app-change.service';
@Component({
  selector: 'menu-notifications',
  templateUrl: './menu-notifications.component.html',
  styleUrls: ['./menu-notifications.component.css']
})
export class MenuNotificationsComponent implements OnInit {
  
  numOfUnread: number;
  messages: Messages;
  num: number;
  ticks = 0;
  isNotificationPromptVisible: boolean;

  // Subscription object
  private timerSubscr: Subscription;

  constructor(private notificationsService: NotificationsService, private messagesService:MessagesService, private acs: AppChangeService) { }

  loadNumOfUnreadNotifications(){
    this.notificationsService.getNumUnread().subscribe(data=>{
      this.numOfUnread = data.num;    
    }, err=>console.log(err)
    );
  }

  ngOnDestroy(){
    this.timerSubscr.unsubscribe();
  }

  

  ngOnInit() {
    this.timerSubscr = TimerObservable.create(0, 12000).subscribe(() => this.loadNumOfUnreadNotifications());  
    this.acs.changeEmitted$.subscribe(
      event => {
        switch (event){
        case this.acs.events.num_notifications_read: this.loadNumOfUnreadNotifications();
      }
    });

    this.messagesService.translate(new Messages).subscribe(data=>this.messages = data);
  }
  
  showNotificationsPropmpt(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isNotificationPromptVisible = true;
  }
}
class Messages {
  notifications = "Notifications";
}