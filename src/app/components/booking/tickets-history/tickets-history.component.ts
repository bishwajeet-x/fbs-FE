import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tickets-history',
  templateUrl: './tickets-history.component.html',
  styleUrls: ['./tickets-history.component.scss']
})
export class TicketsHistoryComponent implements OnInit {

  username: any;
  _ticketHistory: any[] = [];

  constructor(
    private service: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem('login-details') || '').username;
    this.fetchTicketHistory(this.username);
  }

  fetchTicketHistory = (username: string) => {
    const postData = { username };
    this.service.fetchTicketHistory(postData).subscribe(res => {
      this._ticketHistory = res;
    })
  }

  flightStatusColor = (id: number) => {
    let colorClass = 'bg-secondary';
    switch (id) {
      case 101:
        colorClass = 'bg-primary';
        break;
      case 102:
        colorClass = 'bg-success';
        break;
      case 103:
        colorClass = 'bg-warning';
        break;
      case 104:
        colorClass = 'bg-danger';
        break;
      default:
        break;
    }

    return colorClass;
  }

  navigateToTicketDetails = (pnr: string) => {
    this.router.navigate([`/web/schedules/mybooking/${pnr}`])
  }

}
