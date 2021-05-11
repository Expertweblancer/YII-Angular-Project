import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'start-now',
  templateUrl: './start-now.component.html',
  styleUrls: ['./start-now.component.scss']
})
export class StartNowComponent implements OnInit {
  @Input() withSectionHeader;
  @Input() withIllustrations;
  @Input() withoutButton;
  // withSectionHeader: boolean;

  constructor() {}

  ngOnInit() {
    // if (this.withSectionHeader_ver)
    //   this.withSectionHeader = this.withSectionHeader_ver; 
    }

}
