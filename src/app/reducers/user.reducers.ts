import { UserModel } from '../models';
import { UserAction, UserActionTypes } from '../actions';

export function userReducer(state: UserModel, action: UserAction): UserModel {
  switch (action.type) {
    case UserActionTypes.UserAction:
      return action.payload;
    default:
      return state;
  }
}
