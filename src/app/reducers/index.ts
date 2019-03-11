import { ActionReducerMap } from '@ngrx/store';
import { APPStore, LoginModel, TodoListModel } from '../models';
import { UpdateTodosForListAction, LoginAction, LoginActionTypes, TodoListsAction,
         TodoListDetailsAction, TodoListActionTypes } from '../actions';

export const reducers: ActionReducerMap<APPStore> = {
  loginObject: loginReducer,
  todoLists: todoListsReducer,
  todoListDetails: todoListDetailReducer
};

export function loginReducer(state: LoginModel, action: LoginAction): LoginModel {
  switch (action.type) {
    case LoginActionTypes.LoginAction:
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
