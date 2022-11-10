import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MealType } from 'src/app/interfaces/meal-type';
import { Schedule } from 'src/app/interfaces/schedule';
import { AirportCodesService } from 'src/app/services/airport-codes.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  _flight_code!: string;
  _flight!: Schedule;
  source!: string;
  destination!: string;
  mealTypeSelected!: any;
  classSelected: any = {
    name: '',
    fare: 0
  };
  price = 0;

  passengers: {
    index: number;
    name: string;
    age: string;
    gender: string;
}[] = []

  constructor(private formFB: FormBuilder,
    private service: ApiService,
    private iata: AirportCodesService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      this._flight_code = data['flightId'];
      this.fetchFlightDetailsByFlightCode(this._flight_code);
    });
  }

  fetchFlightDetailsByFlightCode = (flightCode: string) => {
    this.service.fetchFlightByCode(flightCode).subscribe(data => {
      this._flight = data;
      this.source = this.fetchIATAByCode(this._flight.source),
      this.destination = this.fetchIATAByCode(this._flight.destination);
      console.log(this._flight)
    })
  }

  fetchIATAByCode(code: string) {
    const airport = this.iata.getAirportByCode(code);
    return `${airport?.IATA_code} - ${airport?.airport_name} (${airport?.city_name})`
  }

  selectMealType(data: any) {
    this.mealTypeSelected = data;
    this.price = this.calculatePrice(this.classSelected);
  }

  selectClass = (self: any) => {
    this.classSelected = self;
    this.price = this.calculatePrice(this.classSelected);
  }

  addPassenger = () => {
    const passenger = {
      index: this.passengers.length + 1,
      name: '',
      age: '',
      gender: ''
    }

    this.passengers.push(passenger);

    this.price = this.calculatePrice(this.classSelected);
  }

  removePassenger = (self: number) => {
    const index = this.passengers.map(item => item.index).findIndex(x => x === self);
    this.passengers.splice(index, 1);
    console.log(this.passengers);
  }

  getDataFromInput = (id: string) => {
    const input = document.querySelector(id) as HTMLInputElement;
    return input.value;
  }

  bookTicket = () => {
    const passengersResp: { name: string; age: string; gender: string; }[] = [];
    this.passengers.forEach( p => {
      const psn = {
        name: this.getDataFromInput(`#name${p.index}`),
        age: this.getDataFromInput(`#age${p.index}`),
        gender: this.getDataFromInput(`#gender${p.index}`),
      }
      passengersResp.push(psn)
    })
    const lcl: string = localStorage.getItem('login-details')||'';
    const username = JSON.parse(lcl).username;
    const postData = {
      name: this.getDataFromInput('#name0'),
      email: this.getDataFromInput('#email0'),
      gender: this.getDataFromInput('#gender0'),
      age: this.getDataFromInput('#age0'),
      fare: this.price,
      flightId: this._flight_code,
      meal: this.mealTypeSelected?.typeName,
      flightClass: this.classSelected.name,
      numberOfSeats: this.passengers.length + 1,
      passengers: passengersResp,
      username: username
    }

    console.log(postData);

    this.service.bookTicket(postData).subscribe((res) => {
      this.toastr.success("Flight booked successfully!");
      this.router.navigate([`/web/schedules/mybooking/${res.ticket.pnr}`])
    }, err => {
      this.toastr.error(`Oops something went wrong!`);
    })


  }

  calculatePrice = (self: any) => {
    if(this.mealTypeSelected?.typeId == 1) {
      return (500 + self.fare) * (this.passengers.length + 1);
    } else if(this.mealTypeSelected?.typeId == 2) {
      return (700 + self.fare) * (this.passengers.length + 1);
    } else {
      return self.fare * (this.passengers.length + 1);
    }
  }

}
