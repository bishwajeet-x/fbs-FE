import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private control = new BehaviorSubject('This is a control message');
  message = this.control.asObservable();

  private userBus: any = new BehaviorSubject<any>({});
  user = this.userBus.asObservable();

  constructor() { }

  newMessage = (message: string) => {
    this.control.next(message);
  }

  newUser = (data: any) => {
    this.userBus.next(data)
  }
}
