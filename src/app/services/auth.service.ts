import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel } from '../models';

const BASE_URL = '​https://os.hallpassandfriends.com';
const SCOPE = '2bcf85b6-698d-4ab4-9910-ecb905b87828';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  submitLogin(loginObject: LoginModel): void {
    const loginURL = BASE_URL + '/api/auth';
    const loginBody = JSON.stringify({
      email: loginObject.email,
      password: loginObject.password,
      scope: SCOPE
    });
    console.log('In AuthService, loginURL = ' , loginURL);
    console.log('In AuthService, loginObject = ' , loginObject);
    this.http.post(loginURL, loginBody)
      .subscribe(response => {
        console.log(response);
      });
  }
}
