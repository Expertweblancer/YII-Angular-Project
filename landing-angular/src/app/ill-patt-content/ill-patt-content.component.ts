import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ill-patt-content',
  templateUrl: './ill-patt-content.component.html',
  styleUrls: ['./ill-patt-content.component.scss']
})
export class IllPattContentComponent implements OnInit {
  @Input() illustrationSrc;
  @Input() header;
  @Input() desc;
  // withSectionHeader: boolean;

  constructor() {}

  ngOnInit() {
    // if (this.withSectionHeader_ver)
    //   this.withSectionHeader = this.withSectionHeader_ver; 
    }

}
