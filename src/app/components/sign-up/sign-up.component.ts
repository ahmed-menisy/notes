import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../service/auth.service';

declare var $: any;
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor(private _AuthService: AuthService, private _Router: Router) {}
  isSignIn: boolean = false;
  isShow: boolean = false;
  type: string = 'password';
  signUpForm: FormGroup = new FormGroup({
    first_name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(25),
    ]),
    last_name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(25),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(10),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,10}$/
      ),
    ]),
    age: new FormControl(null, [
      Validators.required,
      Validators.min(10),
      Validators.max(80),
    ]),
  });
  msgError!: string;
  isRegister: boolean = false;
  ngOnInit(): void {
    $('#signUp').particleground();
  }

  // -----------------------  Sign Up
  subSignUp(dataForm: FormGroup): void {
    this.isRegister = true;
    console.log(dataForm);
    this._AuthService.register(dataForm.value).subscribe({
      next: (response) => {
        console.log(response);
        if (response.message === 'success') {
          this._Router.navigate(['/signin']);
        } else {
          this.msgError = response.message.slice(
            response.message.lastIndexOf(':') + 1
          );
        }
      },
      complete: () => {
        this.isRegister = false;
      },
    });
  }

  // show and hide password
  show(): void {
    this.isShow = true;
    this.type = 'text';
  }
  hidde(): void {
    this.isShow = false;
    this.type = 'password';
  }
}
