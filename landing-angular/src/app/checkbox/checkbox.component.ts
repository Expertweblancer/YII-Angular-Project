import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  // animations: [
  //   trigger(
  //     'enterAnimation', [
  //       transition(':enter', [
  //         style({ transform: 'translateY(-10%)', opacity: 0 }),
  //         animate('100ms', style({ transform: 'translateY(0)', opacity: 1 }))
  //       ]),
  //       transition(':leave', [
  //         style({ transform: 'translateY(0)', opacity: 1 }),
  //         animate('100ms', style({ transform: 'translateY(-10%)', opacity: 0 }))
  //       ])
  //     ]
  //   )
  // ]
})
export class CheckboxComponent implements OnInit {

  // @Input() label: string;
  @Input() id: string;
  @Input() isChecked: boolean;
  @Output() onCheckedChange = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  onChange(isChecked: boolean) {
    this.onCheckedChange.emit(isChecked);
  }

}
