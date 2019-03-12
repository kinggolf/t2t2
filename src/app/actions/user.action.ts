import { Action } from '@ngrx/store';
import { UserModel } from '../models';

export enum UserActionTypes {
  UserAction = 'UserAction',
}

export class UserAction implements Action {
  readonly type = UserActionTypes.UserAction;

  constructor(public payload: UserModel) {}
}
