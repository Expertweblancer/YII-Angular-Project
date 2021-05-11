import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MessagesService } from '../messages/messages.service';
import { AgoDateFormatMessagesModel } from './ago-date-format-messages.model';
import { Subscription,  } from 'rxjs/Rx';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
const INTERVAL=5000;

@Component({
  selector: 'ago-date-format',
  templateUrl: './ago-date-format.component.html',
  styleUrls: ['./ago-date-format.component.css']
})
export class AgoDateFormatComponent implements OnInit, OnDestroy {
  @Input() date:string;
  @Input() messages:AgoDateFormatMessagesModel;
  @Input() live = false;
  displayDate:string;

  // Subscription object
  timerSubscr: Subscription;

  secondCount = 0;

  constructor(private messagesService:MessagesService) { }
  ngOnDestroy(){
    if (this.live && this.timerSubscr)
      this.timerSubscr.unsubscribe();
  }
  ngOnInit() {
    if(this.live){
        this.timerSubscr = TimerObservable.create(INTERVAL, INTERVAL).subscribe(() => this.timeSince());  

    } else 
      this.timeSince()
  }

  timeSince() {
    let date = new Date(this.date)
    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000) + this.secondCount;
    this.secondCount += INTERVAL;
    var interval = Math.floor(seconds / 31536000);
    
    if (interval > 1) {
      this.displayDate = interval + " " + this.messages.years;
      return;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      this.displayDate =  interval + " " + this.messages.months;
      return;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      this.displayDate =  interval + " " + this.messages.days;
      return;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      this.displayDate =  interval + " " + this.messages.hours;
      return;
    }
    this.displayDate = this.messages.less_than_hour;
  }
}
