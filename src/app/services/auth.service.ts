import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel } from '../models';

const BASE_URL = 'https://os.hallpassandfriends.com/api/auth';
const SCOPE = '2bcf85b6-698d-4ab4-9910-ecb905b87828';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  submitLogin(loginObject: LoginModel): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const loginURL = BASE_URL + '/api/auth';
    const loginBody = {
      email: loginObject.email,
      password: loginObject.password,
      scope: SCOPE
    };
    console.log('In AuthService, loginURL = ' , loginURL);
    console.log('In AuthService, loginBody = ' , loginBody);
    this.http.post(loginURL, loginBody, httpOptions)
      .subscribe(response => {
        console.log(response);
      });
  }
}
/*
    console.log('In AuthService, loginBody1 = ' , loginBody1);
    const loginBody1 = JSON.stringify({
      email: loginObject.email,
      password: loginObject.password,
      scope: SCOPE
    });
    'Accept': 'application/json'
        const httpOptions1 = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
 */
