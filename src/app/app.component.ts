import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ShareService } from './services/share.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'flight-booking-system';
  
  loginDetails: any;
  showNav: boolean = false;
  user: any;
  forAdmin: boolean = false;
  
  ngOnInit(): void {
    this.share.message.subscribe(msg => {
      if(msg == 'loggedIn') {
        this.showNav = true;
        this.handleLogin();
      }
    });

    this.share.user.subscribe((data: any) => {
      this.user = data;
    })
    this.loginDetails = localStorage.getItem('login-details');
    this.handleLogin();
  }

  constructor(private router: Router,
    private share: ShareService,
    private toastr: ToastrService) {}

  handleLogin = () => {
    this.loginDetails = localStorage.getItem('login-details');
    if(this.loginDetails){ 
      this.showNav = true;
      this.user = JSON.parse(this.loginDetails);
      const roles = this.user.roles.map((u: { name: any; }) => u.name);
      if(roles.includes('ROLE_ADMIN')) {
        this.forAdmin = true;
      } else if(roles.includes('ROLE_USER')) {
        this.forAdmin = false;
      }
    } else {
      this.router.navigate(['/'])
    }
  }

  doLogout() {
    localStorage.clear();
    this.router.navigate(['/']);
    this.showNav = false;
    this.toastr.success('Logged out successfully!')
  }

  shift() {
    if(this.showNav) 
      return 'shift'
    else 
      return 'full-width';
  }
  
  


}
