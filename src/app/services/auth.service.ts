import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }
  
  basePath = `${AppConstants.BasePath}auth/api/`;
  loginPath = AppConstants.LoginPath;
  
  headers = () => {
    const access_token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${access_token}`);
    return {headers};
  }


  get = (url: string) => {
    return this.http.get(`${this.basePath}${url}`, this.headers())
  }

  post = (url: string, data: any|FormData) => {
    return this.http.post(`${this.basePath}${url}`, data, this.headers())
  }

  put = (url: string, data: any|FormData) => {
    return this.http.put(`${this.basePath}${url}`, data, this.headers())
  }

  delete = (url: string) => {
    return this.http.delete(`${this.basePath}${url}`, this.headers())
  }
  
}
