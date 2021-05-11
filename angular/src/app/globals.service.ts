import { Observer } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
export class GlobalsService {
  globalVar:string;
  globalVarUpdate:Observable<string>;
  globalVarObserver:Observer<any>;

  constructor() {
    this.globalVarUpdate = Observable.create((observer:Observer<any>) => {
      this.globalVarObserver = observer;
    });
  }

  updateGlobalVar(newValue:string) {
    this.globalVar = newValue;
    this.globalVarObserver.next(this.globalVar);
  }
}