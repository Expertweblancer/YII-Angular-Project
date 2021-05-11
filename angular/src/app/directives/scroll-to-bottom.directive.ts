import { Directive,ElementRef,AfterViewChecked} from '@angular/core';


@Directive({ selector: '[scrollToBottom]' })
export class ScrollToBottomDirective implements AfterViewChecked {
    constructor(private element:ElementRef) {
        console.log('scroll', this.element);
    }
    ngAfterViewChecked(){
        this.scrollToBottom();
    }
    scrollToBottom(){
        if(this.element){
            (this.element as any).nativeElement.scrollTop =(this.element as any).nativeElement.scrollHeight;
            console.log('scroll', (this.element as any).nativeElement.scrollTop) 
            console.log('scrollHeight', (this.element as any).nativeElement.scrollHeight) 
        }
    }
}