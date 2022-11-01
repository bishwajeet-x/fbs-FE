import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Schedule } from 'src/app/interfaces/schedule';
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

  constructor(private toastr: ToastrService,
    private service: ApiService,
    private iataService: AirportCodesService,
    private router: Router,
    private modalService: BsModalService,
    private share: ShareService) { }

  ngOnInit(): void {
    this.fetchAllSchedules();
  }

  fetchAllSchedules = () => {
    this.service.fetchAllSchedule().subscribe(res => {
      this.allSchedules = res.map((flight: Schedule) => {
        const source = this.iataService.getAirportByCode(flight.source);
        const destination = this.iataService.getAirportByCode(flight.destination);
        return {
          flightCode: flight.flightCode,
          airline: flight.airline,
          source: `${source?.IATA_code} - ${source?.airport_name}`,
          destination: `${destination?.IATA_code} - ${destination?.airport_name}`,
          flightClass: flight.flightClass,
          eta: this.getTimeString(flight.eta),
          sta: this.getTimeString(flight.sta),
          flightHours: flight.flightHours,
          status: flight.status
        }
      })
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

}
