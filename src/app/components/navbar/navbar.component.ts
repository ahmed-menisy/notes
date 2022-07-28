import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private _AuthService: AuthService) {}
  isLogin: boolean = false;
  userName!: string;
  ngOnInit(): void {
    // Check If User Log in Change isLogin to true or false
    this._AuthService.userData.subscribe({
      next: () => {
        if (this._AuthService.userData.getValue()) {
          this.isLogin = true; // if user log in and userData full value
          this.userName = this._AuthService.userData.getValue().first_name;
        } else {
          this.isLogin = false; // if userData  equal null
        }
      },
    });
  }
  logOut(): void {
    this._AuthService.logOut();
  }
}
