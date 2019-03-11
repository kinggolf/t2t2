import { ActionReducerMap } from '@ngrx/store';
import { APPStore, LoginModel, TodoListModel, UserModel } from '../models';
import { UpdateTodosForListAction, LoginAction, LoginActionTypes, TodoListsAction,
         TodoListDetailsAction, TodoListActionTypes, UserAction, UserActionTypes } from '../actions';

export const reducers: ActionReducerMap<APPStore> = {
  loginObject: loginReducer,
  todoLists: todoListsReducer,
  todoListDetails: todoListDetailReducer,
  currentUser: userReducer
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

export function todoListsReducer(state: TodoListModel[], action: TodoListsAction): TodoListModel[] {
  switch (action.type) {
    case TodoListActionTypes.TodoListsAction:
      return action.payload;
    default:
      return state;
  }
}

export function todoListDetailReducer(state: TodoListModel, action: TodoListDetailsAction): TodoListModel {
  switch (action.type) {
    case TodoListActionTypes.TodoListDetailsAction:
      return action.payload;
    default:
      return state;
  }
}

export function updateTodosForListReducer(state: TodoListModel[], action: UpdateTodosForListAction): TodoListModel[] {
  switch (action.type) {
    case TodoListActionTypes.UpdateTodosForListAction:
      return action.payload;
    default:
      return state;
  }
}
