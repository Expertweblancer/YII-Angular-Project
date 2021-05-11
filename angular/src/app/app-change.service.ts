import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppChangeService {
    events = new Events();
    // Observable string sources
    private emitChangeSource = new Subject<any>();
    // Observable string streams
    changeEmitted$ = this.emitChangeSource.asObservable();
    // Service message commands
    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }
}

class Events{
    reload_profile = 'reload-profile';
    logout = 'logout';
    num_msgs_read = 'num-msgs-read';
    num_notifications_read = "num-ntfct-read";
    srv_error = "server-error";
}
