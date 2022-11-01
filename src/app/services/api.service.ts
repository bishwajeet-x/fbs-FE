import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  basePath = 'http://localhost:8080';

  fetchAllMealTypes = (): Observable<any> => {
    return this.http.get(`${this.basePath}/api/airlines/mealTypes`);
  }

  fetchAllAirlines = (): Observable<any> => {
    return this.http.get(`${this.basePath}/api/airlines/`);
  }

  addAirline = (data: any): Observable<any> => {
    return this.http.post(`${this.basePath}/api/airlines/`, data);
  }

  fetchAirlineById = (id: number): Observable<any> => {
    return this.http.get(`${this.basePath}/api/airlines/search?id=${id}`);
  }

  editAirline = (data: any): Observable<any> => {
    return this.http.put(`${this.basePath}/api/airlines/`, data);
  }

  updateStatus = (data: any): Observable<any> => {
    return this.http.put(`${this.basePath}/api/airlines/status`, data);
  }

  deleteAirline = (id: number): Observable<any> => {
    return this.http.delete(`${this.basePath}/api/airlines/?id=${id}`);
  }

  //schedule
  createSchedule = (data: any): Observable<any> => {
    return this.http.post(`${this.basePath}/api/flights/`, data);
  }

  fetchAllSchedule = (): Observable<any> => {
    return this.http.get(`${this.basePath}/api/flights/`);
  }

  fetchFlightByCode = (code: string): Observable<any> => {
    return this.http.get(`${this.basePath}/api/flights/search?id=${code}`);
  }

  editSchedule = (data: any): Observable<any> => {
    return this.http.put(`${this.basePath}/api/flights/`, data);
  }

  deleteSchedule = (code: string): Observable<any> => {
    return this.http.delete(`${this.basePath}/api/flights/?id=${code}`);
  }

  changeFlightStatus = (data: any): Observable<any> => {
    return this.http.put(`${this.basePath}/api/flights/status`, data);
  }
}
