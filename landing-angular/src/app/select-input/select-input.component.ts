import { Component, OnInit, Input } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateY(-10%)', opacity: 0 }),
          animate('100ms', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateY(0)', opacity: 1 }),
          animate('100ms', style({ transform: 'translateY(-10%)', opacity: 0 }))
        ])
      ]
    )
  ]
})
export class SelectInputComponent implements OnInit {

  @Input() label: string;
  @Input() options: string[];
  isActive = false;
  activeOption: number|null = null;

  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {
    window.removeEventListener('click', this.handleOnWindowClick);
  }
  
  showOptions() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      setTimeout(() => window.addEventListener('click', this.handleOnWindowClick));
    }
  }

  setActiveOption(optionIndex: number) {
    this.activeOption = optionIndex;
  }

  handleOnWindowClick = () => {
    window.removeEventListener('click', this.handleOnWindowClick);
    this.isActive = false;
  }

}
