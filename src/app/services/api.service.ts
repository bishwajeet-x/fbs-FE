import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AppConstants } from '../app-constants';
import { AuthService } from './auth.service';
import { UnauthService } from './unauth.service';

import { Constants } from '../components/common/constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,
    private auth: AuthService,
    private unauth: UnauthService) { }

  basePath = `${AppConstants.BasePath}auth/api/`;
  loginPath = AppConstants.LoginPath;



  doLogin = (data: FormData): Observable<any> => {
    return this.http.post(this.loginPath, data);
  }

  headers = () => {
    const access_token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${access_token}`);
    return {headers};
  }

  fetchUserByUsername = (username: string): Observable<any> => {
    return this.auth.get(`users?username=${username}`);
  }

  fetchAllMealTypes = (): Observable<any> => {
    return this.auth.get(`airlines/mealTypes`);
  }

  fetchAllAirlines = (): Observable<any> => {
    return this.auth.get(`airlines/`);
  }

  addAirline = (data: any): Observable<any> => {
    return this.auth.post(`airlines/`, data);
  }

  fetchAirlineById = (id: number): Observable<any> => {
    return this.auth.get(`airlines/search?id=${id}`);
  }

  editAirline = (data: any): Observable<any> => {
    return this.auth.put(`airlines/`, data);
  }

  updateStatus = (data: any): Observable<any> => {
    return this.auth.put(`airlines/status`, data);
  }

  deleteAirline = (id: number): Observable<any> => {
    return this.auth.delete(`airlines/?id=${id}`);
  }

  //schedule
  createSchedule = (data: any): Observable<any> => {
    return this.auth.post(`flights/`, data);
  }

  fetchAllSchedule = (): Observable<any> => {
    return this.unauth.get(`flights/`);
  }

  fetchFlightByCode = (code: string): Observable<any> => {
    return this.auth.get(`flights/search?id=${code}`);
  }

  editSchedule = (data: any): Observable<any> => {
    return this.auth.put(`flights/`, data);
  }

  deleteSchedule = (code: string): Observable<any> => {
    return this.auth.delete(`flights/?id=${code}`);
  }

  changeFlightStatus = (data: any): Observable<any> => {
    return this.auth.put(`flights/status`, data);
  }

  searchSchedule = (data: any): Observable<any> => {
    return this.unauth.post(`flights/search`, data);
  }

  //tickets
  bookTicket = (data: any): Observable<any> => {
    return this.auth.post(`tickets/book`, data);
  }
  
  fetchTicketByPnr = (pnr: string): Observable<any> => {
    return this.auth.get(`tickets/search?pnr=${pnr}`);
  }

  fetchTicketHistory = (data: any): Observable<any> => {
    return this.auth.post(`tickets/history`, data);
  }

  cancelTicket = (pnr: string): Observable<any> => {
    return this.auth.get(`tickets/cancel?pnr=${pnr}`);
  }
}
