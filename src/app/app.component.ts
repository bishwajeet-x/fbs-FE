import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'flight-booking-system';
  
  accessToken: any;
  showNav: boolean = false;
  
  ngOnInit(): void {
    this.accessToken = JSON.parse(localStorage.getItem('access_token') || '');
    if(this.accessToken.username === 'admin') 
      this.showNav = true;
  }

  constructor(private router: Router) {}

  doLogout() {
    console.log('called')
    localStorage.removeItem('access_token');
    this.router.navigate(['/'])
  }
  
  


}
