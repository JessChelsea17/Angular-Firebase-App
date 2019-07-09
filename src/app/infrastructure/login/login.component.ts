import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private hide = true;
  loginForm: FormGroup;
  errorMessage: string = '';
  ifFbGoogle = true;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
     })
  }

  ngOnInit() {
  }

  tryLogin(value) {
      //proceeds to auth service
      this.authService.doLogin(value)
      .then(res => {
        this.router.navigate(['/navside']);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      })
  }

  signInWithGoogle() { 
    this.authService.doGoogleLogin()
      .then(res => {
        this.router.navigate(['/navside']);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      })
    }

    signInWithFacebook() {
      this.authService.doFacebookLogin()
      .then(res => {
        this.router.navigate(['/navside']);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      })
    }
}
