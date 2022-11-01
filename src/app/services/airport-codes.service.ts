import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { iata } from '../data/IATACodes';

@Injectable({
  providedIn: 'root'
})
export class AirportCodesService {

  basePath = `https://iatacodes-iatacodes-v1.p.rapidapi.com/api/v9/flights`;

  constructor(private http: HttpClient) { }

  getAreaCodesAndNames = (): any[] => {
    return iata.airports.map(air => `${air.IATA_code} - ${air.airport_name}, ${air.city_name}`)
  }

  getAirportByCode = (code: string) => {
    return iata.airports.find(airport => airport['IATA_code'] === code);
  }

  getAirportByName = (name: string) => {
    return iata.airports.find(airport => airport.airport_name === name);
  }
}
