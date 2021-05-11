import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'notification-prompt',
  templateUrl: './notification-prompt.component.html',
  styleUrls: ['./notification-prompt.component.scss']
})
export class NotificationPromptComponent implements OnInit {

  @Input() isVisible: boolean;

  constructor() { }

  ngOnInit() { }
}