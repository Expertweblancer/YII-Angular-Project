import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'custom-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() linkLabel: string;
  @Input() error: string;
  @Input() isDisabled: boolean = false;
  @Input() type: string;
  @Input() value: string;
  @Output() changeValue = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  onChange(newValue: string) {
    this.changeValue.emit(newValue);
  }

}
