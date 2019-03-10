import { Action } from '@ngrx/store';
import { LoginModel } from '../models';

export enum LoginActionTypes {
  LoginAction = 'LoginAction',
}

export class LoginAction implements Action {
  readonly type = LoginActionTypes.LoginAction;

  constructor(public payload: LoginModel) {}
}

