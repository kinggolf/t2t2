import { ActionReducerMap } from '@ngrx/store';
import { APPStore, LoginModel, TodoListModel } from '../models';
import { LoginAction, LoginActionTypes, TodoListAction, TodoListActionTypes } from '../actions';

export const reducers: ActionReducerMap<APPStore> = {
  loginObject: loginReducer,
  todoLists: todoListReducer
};

export function loginReducer(state: LoginModel, action: LoginAction): LoginModel {
  switch (action.type) {
    case LoginActionTypes.LoginAction:
      return action.payload;
    default:
      return state;
  }
}

export function todoListReducer(state: TodoListModel[], action: TodoListAction): TodoListModel[] {
  switch (action.type) {
    case TodoListActionTypes.TodoListAction:
      return action.payload;
    default:
      return state;
  }
}
