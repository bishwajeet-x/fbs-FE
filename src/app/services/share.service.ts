import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private control = new BehaviorSubject('This is a control message');
  message = this.control.asObservable();

  constructor() { }

  newMessage = (message: string) => {
    this.control.next(message);
  }
}
