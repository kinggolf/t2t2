import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { APPStore, BASE_URL, SCOPE, LoginModel, UserModel } from '../models';
import { UserAction } from '../actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private store: Store<APPStore>) { }

  submitLogin(loginObject: LoginModel): void {
    // httpOptions probably not required, but included here for completeness
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
    this.http.post<UserModel>(loginURL, loginBody, httpOptions)
      .subscribe(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.store.dispatch(new UserAction(user));
      });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.store.dispatch(new UserAction(null));
  }

}
