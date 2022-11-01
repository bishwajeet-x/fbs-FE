import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
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

  doLogin(data: any) {
    localStorage.setItem('access_token', JSON.stringify(data));
    if(data.username === 'admin') {
      this.router.navigate(['/admin/airlines'])
    }
  }

}
