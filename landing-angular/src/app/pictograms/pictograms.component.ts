import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pictograms',
  templateUrl: './pictograms.component.html',
  styleUrls: ['./pictograms.component.scss']
})
export class PictogramsComponent implements OnInit {
  @Input() pictograms;
  // withSectionHeader: boolean;

  constructor() {}

  ngOnInit() {
    // if (this.withSectionHeader_ver)
    //   this.withSectionHeader = this.withSectionHeader_ver; 
    }

}
