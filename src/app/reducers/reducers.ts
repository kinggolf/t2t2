import { ActionReducerMap } from '@ngrx/store';
import { APPStore, LoginModel, UserModel } from '../models';
import { LoginAction, LoginActionTypes, UserAction, UserActionTypes} from '../actions';
import { todoListsReducer } from './todo-lists.reducers';
import { activeTodoListReducer } from './active-todo-list.reducers';

export const reducers: ActionReducerMap<APPStore> = {
  loginObject: loginReducer,
  currentUser: userReducer,
  todoLists: todoListsReducer,
  activeTodoList: activeTodoListReducer,
};

export function loginReducer(state: LoginModel, action: LoginAction): LoginModel {
  switch (action.type) {
    case LoginActionTypes.LoginAction:
      return action.payload;
    default:
      return state;
  }
}

export function userReducer(state: UserModel, action: UserAction): UserModel {
  switch (action.type) {
    case UserActionTypes.UserAction:
      return action.payload;
    default:
      return state;
  }
}
