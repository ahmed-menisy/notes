import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(private _AuthService: AuthService, private _Router: Router) {}
  signInForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(10),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,10}$/
      ),
    ]),
  });
  msgError!: string;
  isSignIn: boolean = false;
  ngOnInit(): void {
    $('#signIn').particleground();
  }
  subSignIn(dataForm: FormGroup): void {
    this.isSignIn = true;
    console.log(dataForm);
    this._AuthService.logIn(dataForm.value).subscribe({
      next: (response) => {
        console.log(response);
        if (response.message === 'success') {
          // Alert Show
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Signed in successfully',
          });

          localStorage.setItem('tokenNote', response.token);
          localStorage.setItem('idNote', response.user._id);
          this._AuthService.saveUserData();
          this._Router.navigate(['/home']);
        } else {
          this.msgError = response.message.slice(
            response.message.lastIndexOf(':') + 1
          );
        }
      },
      complete: () => {
        this.isSignIn = false;
      },
    });
  }
}
