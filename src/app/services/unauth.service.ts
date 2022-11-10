import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root'
})
export class UnauthService {

  constructor(private http: HttpClient) { }

  basePath = `${AppConstants.BasePath}unauth/api/`;

  get = (url: string) => {
    return this.http.get(`${this.basePath}${url}`)
  }

  post = (url: string, data: any|FormData) => {
    return this.http.post(`${this.basePath}${url}`, data)
  }

  put = (url: string, data: any|FormData) => {
    return this.http.put(`${this.basePath}${url}`, data)
  }

  delete = (url: string) => {
    return this.http.delete(`${this.basePath}${url}`)
  }
  

}
