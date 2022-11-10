import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  _ticket: any;
  eta!: string;
  canCancel: boolean = false;
  _pnr!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: ApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      this._pnr = data['pnr'];
      this.fetchTicketData(this._pnr);
    });
  }

  fetchTicketData = (pnr: string) => {
    this.service.fetchTicketByPnr(pnr).subscribe(res => {
      this._ticket = res;
      this.eta = `${new Date(this._ticket.flight.eta).toLocaleDateString()} ${new Date(this._ticket.flight.eta).toLocaleTimeString()}`
      const currDate = new Date();
      const ticketDate = new Date(this._ticket.flight.eta);
      const msBetweenDates = currDate.getTime() - ticketDate.getTime();
      if(convertMsToTime(msBetweenDates) <= 24 && this._ticket.ticket.status === 'BOOKED') {
        this.canCancel = true;
      }

      if(this._ticket.ticket.status === 'CANCELLED') {
        this.canCancel = false;
      }
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

  cancelTicket = () => {
    if(confirm('Are you sure you want to cancel this ticket?')) {
      this.service.cancelTicket(this._ticket.ticket.pnr).subscribe(() => {
        this.toastr.success("Ticket cancelled successfully!");
        this.fetchTicketData(this._pnr);
      }, err => {
        this.toastr.error(`Oops something went wrong!`);
      });
    } else {
      this.toastr.success("Action cancelled!");
    }
  }

}

function padTo2Digits(num: number) {
  return parseInt(num.toString().padStart(2, '0'));
}

function convertMsToTime(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  // 👇️ If you want to roll hours over, e.g. 00 to 24
  // 👇️ uncomment the line below
  // uncommenting next line gets you `00:00:00` instead of `24:00:00`
  // or `12:15:31` instead of `36:15:31`, etc.
  // 👇️ (roll hours over)
  // hours = hours % 24;

  // return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
  //   seconds,
  // )}`;
  return padTo2Digits(hours);
}