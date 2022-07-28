import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private _Router: Router) {
    this.saveUserData();
  }
  baseUrl: string = 'https://routeegypt.herokuapp.com/';
  userData: BehaviorSubject<any> = new BehaviorSubject(null);
  encodeToken!: string | null;
  idUser!: string | null;
  // Registration User
  register(data: object): Observable<any> {
    return this.http.post(`${this.baseUrl}signup`, data);
  }
  // Login User
  logIn(data: object): Observable<any> {
    return this.http.post(`${this.baseUrl}signin`, data);
  }
  // Save User Data
  saveUserData() {
    this.encodeToken = localStorage.getItem('tokenNote');
    if (this.encodeToken) {
      const decodeToken = jwtDecode(this.encodeToken);
      this.userData.next(decodeToken);
      console.log(this.userData.getValue());
      this.idUser = this.userData.getValue()._id;
    }
  }
  logOut(): void {
    this.http.post(`${this.baseUrl}signOut`, { token: this.encodeToken });
    localStorage.removeItem('tokenNote');
    localStorage.removeItem('idNote');
    this.userData.next(null);
    this._Router.navigate(['/signin']);
  }
}
