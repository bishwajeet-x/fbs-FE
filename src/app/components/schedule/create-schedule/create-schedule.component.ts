import { formatDate } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Airline } from 'src/app/interfaces/airline';
import { FlightClass } from 'src/app/interfaces/flight-class';
import { Schedule } from 'src/app/interfaces/schedule';
import { AirportCodesService } from 'src/app/services/airport-codes.service';
import { ApiService } from 'src/app/services/api.service';
import { Constants } from '../../common/constants';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CreateScheduleComponent implements OnInit {
  allAirlines: Airline[] = [];
  allAirlinesNames: string[] = [];
  myDateValue!: Date;
  minDate: Date = new Date();
  maxDate: Date = new Date("2027-12-01");
  source!: string;
  destination!: string;
  airline!: string;
  scheduleForm!: FormGroup;
  sta: any; eta: any;
  flightClassToggle: any = {
    'economy': {
      added: false,
      fare: 0
    },
    'business': {
      added: false,
      fare: 0
    },
  }

  action: string = 'create';
  _flightCode!: number;

  constructor(private service: ApiService,
    private codeService: AirportCodesService,
    private fB: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchAllAirlines();
    this.fetchAllAirportCodes();
    this.myDateValue = new Date();
    this.createFormInstance();
    this.activatedRoute.params.subscribe(data => {
      if(this.handleAction(data) === 'edit') {
        this.fetchFlightByCode(data['fCode']);
      }
    });
  }

  handleAction = (data: any) => {
    this._flightCode = data['fCode'];
    this.action = this._flightCode ? 'edit' : 'create';
    return this.action;
  }

  fetchFlightByCode = (code: string) => {
    this.service.fetchFlightByCode(code).subscribe(data => {
      console.log(data)
      this.setDataToForm(data);
    })
  }

  fetchAllAirlines = () => {
    this.service.fetchAllAirlines().subscribe(
      data => {
        this.allAirlines = data;
      }
    )
  }

  fetchAllAirlineNames = () => {
    return this.allAirlines.map(airline => airline.airlineName);
  }

  fetchAllAirportCodes = () => {
    return this.codeService.getAreaCodesAndNames();
  }

  fetchAirportByCode = (iata: string) => {
    console.log(this.codeService.getAirportByCode(iata))
  }

  doesSomething(data: any) {
    const selectedDate = new Date(data.scheduledFor);
    const scheduledFor = `${selectedDate.getDate()}/${selectedDate.getMonth()}/${selectedDate.getFullYear()}`;
    const airlineId = this.allAirlines.find(x => x.airlineName === data.airline)?.airlineId;

    const flightClass: FlightClass[] = [];
    Object.keys(this.flightClassToggle).forEach((item) => {
      if(this.flightClassToggle[item].added) {
        flightClass.push({
          name: `${item.charAt(0).toUpperCase()}${item.substring(1, item.length)}`,
          fare: this.flightClassToggle[item].fare
        })
      }
    });
    
    const postData = {
      flightCode: data.flightCode,
      airlineId: airlineId,
      scheduledFor: scheduledFor,
      sta: this.sta,
      eta: this.eta,
      flightHours: data.flightHours,
      source: data.source.split('-')[0].replace(' ', ''),
      destination: data.destination.split('-')[0].replace(' ', ''),
      flightClass: flightClass,
      status: Constants.ON_TIME
    }
    console.log(postData)

    if(this.action === 'create') {
      this.service.createSchedule(postData).subscribe(() => {
        this.toastr.success(`Schedule created successfully!`);
      })
    } else {
      this.service.editSchedule(postData).subscribe(() => {
        this.toastr.success(`Schedule edited successfully!`);
      })
    }
    this.router.navigate(['/admin/schedule']);

  }

  createFormInstance = () => {
    this.scheduleForm = this.fB.group({
      flightCode: ['', Validators.compose([Validators.required])],
      airline: ['', Validators.compose([Validators.required])],
      scheduledFor: [this.myDateValue, Validators.compose([Validators.required])],
      eta: ["04:25 PM", Validators.compose([Validators.required])],
      sta: ["04:25 PM", Validators.compose([Validators.required])],
      source: ['', Validators.compose([Validators.required])],
      destination: ['', Validators.compose([Validators.required])],
      flightHours: ['', Validators.compose([Validators.required])],
    });
  }

  selectClass = (data: 'business' | 'economy') => {
    const cls = document.querySelector(`#${data}`) as HTMLInputElement
    this.flightClassToggle[data].added = cls.checked;
  }

  getFare(event: any, data: 'business' | 'economy') {
    this.flightClassToggle[data].fare = parseFloat(event.target.value);
  }

  setDataToForm = (data: Schedule) => {
    this.scheduleForm.controls['sta'].setValue(data.sta);
    this.scheduleForm.controls['eta'].setValue(data.eta);
    this.scheduleForm.controls['flightCode'].setValue(data.flightCode);
    this.scheduleForm.controls['source'].setValue(data.source);
    this.scheduleForm.controls['destination'].setValue(data.destination);
    this.scheduleForm.controls['flightHours'].setValue(data.flightHours);
    this.scheduleForm.controls['airline'].setValue(data.airline.airlineName);
    data.flightClass.forEach(fc => {
      const name = fc.name.toLowerCase();
      this.flightClassToggle[name].added = true;
      this.flightClassToggle[name].fare = fc.fare;
    })

    console.log(this.flightClassToggle)
  }

}
