import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { ShareService } from 'src/app/services/share.service';

const bcrypt = require('bcryptjs');


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;

  constructor(
    private formFB: FormBuilder,
    private router: Router,
    private service: ApiService,
    private toastr: ToastrService,
    private share: ShareService
  ) { 
    this.createLoginFormInstance();
  }

  ngOnInit(): void {
  }

  private createLoginFormInstance() {
    this.loginForm = this.formFB.group({
      username: [
        '',
        Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]{6,20}$/)])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!*])[A-Za-z\d$@$!*]{8,20}$/)])
      ]
    });
  }

  parseJwt (token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  doLogin(data: any) {
    const formData = new FormData();
    formData.set('username', data.username);

    var hash = bcrypt.hashSync(data.password);

    //formData.set('password', hash);
    formData.set('password', data.password);
    
    this.service.doLogin(formData).subscribe(res => {
      localStorage.setItem('access_token', res.access_token);
      const decoded = this.parseJwt(res.access_token)
      this.service.fetchUserByUsername(decoded.sub).subscribe(res => {
        localStorage.setItem('login-details', JSON.stringify(res));
        this.share.newMessage('loggedIn');
        this.share.newUser(res);
        const roles = res.roles.map((u: { name: any; }) => u.name);
        if(roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin/airlines']);
        } else {
          this.router.navigate(['/web/schedules']);
        }
      })
    }, err => {
      this.toastr.error(`Username or password didn't match`);
    })
    // localStorage.setItem('access_token', JSON.stringify(data));
  }

}
