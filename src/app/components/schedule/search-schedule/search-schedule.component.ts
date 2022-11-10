import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Schedule, SearchSchedule } from 'src/app/interfaces/schedule';
import { AirportCodesService } from 'src/app/services/airport-codes.service';
import { ApiService } from 'src/app/services/api.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-search-schedule',
  templateUrl: './search-schedule.component.html',
  styleUrls: ['./search-schedule.component.scss']
})
export class SearchScheduleComponent implements OnInit {

  allSchedules: Schedule[] = [];
  source: any;
  sourceIATA: any = '--';
  destination: any;
  destinationIATA: any = '--';

  minDate: Date = new Date();
  maxDate: Date = new Date("2027-12-01");
  myDateValue!: Date;

  constructor(private toastr: ToastrService,
    private service: ApiService,
    private iataService: AirportCodesService,
    private router: Router,
    private share: ShareService) { }

  ngOnInit(): void {
    this.fetchAllSchedules();
  }

  fetchAllAirportCodes = () => {
    return this.iataService.getAreaCodesAndNames();
  }

  buildScheduleList = (res: any) => {
    return res.map((flight: Schedule) => {
      const source = this.iataService.getAirportByCode(flight.source);
      const destination = this.iataService.getAirportByCode(flight.destination);
      return {
        flightCode: flight.flightCode,
        airline: flight.airline,
        source: `${source?.IATA_code} - ${source?.airport_name}`,
        destination: `${destination?.IATA_code} - ${destination?.airport_name}`,
        flightClass: flight.flightClass,
        boardingDate: this.getDateString(new Date(flight.eta)),
        eta: this.getTimeString(flight.eta),
        sta: this.getTimeString(flight.sta),
        flightHours: flight.flightHours,
        status: flight.status
      }
    });
  }

  fetchAllSchedules = () => {
    this.service.fetchAllSchedule().subscribe(res => {
      this.allSchedules = this.buildScheduleList(res);
    })
  }

  getTimeString = (date: string) => {
    let text = new Date(date).toLocaleTimeString();
    if(text.length == 10) {
        text = `0${text}`;
    }
    return `${text.substring(0, 5)} ${text.substring(9, 11)}`;
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

  getFCIcons = (data: string) => {
    if(data === 'Business') {
      return 'bi bi-briefcase';
    } else {
      return 'bi bi-cash';
    }
  }

  onSourceSelection = (event: any) => {
    const temp = event.item.split('-');
    this.sourceIATA = temp[0];
    this.source = temp[1];
  }

  onDestinationSelection = (event: any) => {
    const temp = event.item.split('-');
    this.destinationIATA = temp[0];
    this.destination = temp[1];
  }

  searchFlights = () => {
    const searchParams: SearchSchedule = {
      date: this.getDateString(this.myDateValue),
      source: this.sourceIATA.trim(),
      destination: this.destinationIATA.trim(),
      trip: null
    }

    this.service.searchSchedule(searchParams).subscribe(res => {
      this.allSchedules = this.buildScheduleList(res);
    })

  }

  getDateString = (date: Date) => {
    const [month, day, year] = date.toLocaleDateString().split("/");
    const dayString = day.length == 1 ? `0${day}` : day;
    const monthString = month.length == 1 ? `0${month}` : month;
    return `${year}/${dayString}/${monthString}`;
  }

  navigateToBooking = (data: any) => {
    this.router.navigate([`/web/schedules/booking/${data.flightCode}`])
  }

}
