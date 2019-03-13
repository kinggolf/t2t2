import { ActionReducerMap } from '@ngrx/store';
import { APPStore, LoginModel, TodoListModel, UserModel } from '../models';
import { UpdateTodosForListAction, LoginAction, LoginActionTypes, TodoListsAction,
         TodoListDetailsAction, TodoListActionTypes, UserAction, UserActionTypes,
         CreatingNewListAction, CreatingNewListActionTypes, CreatingNewTodoAction,
         PrevTodoListsAction, PrevTodoListDetailsAction, UpdateListDetailsLoadingAction } from '../actions';

export const reducers: ActionReducerMap<APPStore> = {
  loginObject: loginReducer,
  todoLists: todoListsReducer,
  todoListDetails: todoListDetailsReducer,
  prevTodoLists: prevTodoListsReducer,
  prevTodoListDetails: prevTodoListDetailReducer,
  currentUser: userReducer,
  creatingNewList: creatingNewListReducer,
  creatingNewTodo: creatingNewTodoReducer,
  listDetailsLoading: updateListDetailsLoadingReducer,
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

export function prevTodoListsReducer(state: TodoListModel[], action: PrevTodoListsAction): TodoListModel[] {
  switch (action.type) {
    case TodoListActionTypes.PrevTodoListsAction:
      return action.payload;
    default:
      return state;
  }
}

export function todoListDetailsReducer(state: TodoListModel, action: TodoListDetailsAction): TodoListModel {
  switch (action.type) {
    case TodoListActionTypes.TodoListDetailsAction:
      return action.payload;
    default:
      return state;
  }
}

export function prevTodoListDetailReducer(state: TodoListModel, action: PrevTodoListDetailsAction): TodoListModel {
  switch (action.type) {
    case TodoListActionTypes.PrevTodoListDetailsAction:
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

export function creatingNewListReducer(state: boolean, action: CreatingNewListAction): boolean {
  switch (action.type) {
    case CreatingNewListActionTypes.CreatingNewListAction:
      return action.payload;
    default:
      return state;
  }
}

export function creatingNewTodoReducer(state: boolean, action: CreatingNewTodoAction): boolean {
  switch (action.type) {
    case CreatingNewListActionTypes.CreatingNewTodoAction:
      return action.payload;
    default:
      return state;
  }
}

export function updateListDetailsLoadingReducer(state: boolean, action: UpdateListDetailsLoadingAction): boolean {
  switch (action.type) {
    case TodoListActionTypes.UpdateListDetailsLoadingAction:
      return action.payload;
    default:
      return state;
  }
}
