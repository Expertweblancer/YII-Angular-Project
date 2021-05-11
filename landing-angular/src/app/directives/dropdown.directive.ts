import {Directive, HostListener, HostBinding} from '@angular/core';

  @Directive({
    selector: '[shipmeDropdown]'
  })
  export class DropdownDirective {

    private isOpen:boolean = false;

    @HostBinding('class.show') get opened(){
      console.log('dropdown is open? '+ this.isOpen);
      
      return this.isOpen;
    }
    constructor() { }

    @HostListener('click') open(){
      this.isOpen = true;
    }

    @HostListener('mouseleave') close(){
      this.isOpen = false;
    }
  }