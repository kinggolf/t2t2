import { ActionReducerMap } from '@ngrx/store';
import { APPStore, LoginModel, TodoListModel, UserModel } from '../models';
import { CreateNewTodoListAction, LoginAction, LoginActionTypes,
         OpenCloseTodoListAction, PrevTodoListsAction, TodoListActionTypes, LoadTodoListsAction,
         UpdateListDetailsLoadingAction, UserAction, UserActionTypes} from '../actions';
import { todoListsReducer } from './todo-lists.reducers';
import { todosReducer } from './todos.reducers';

export const reducers: ActionReducerMap<APPStore> = {
  loginObject: loginReducer,
  todoLists: todoListsReducer,
  prevTodoLists: prevTodoListsReducer,
  currentUser: userReducer,
  creatingNewList: creatingNewListReducer,
  listDetailsLoading: updateListDetailsLoadingReducer,
};
// creatingNewTodo: creatingNewTodoReducer, CreatingNewTodoAction,  UpdateTodosForListAction,
// todoListDetails: todoListDetailsReducer,  TodoListDetailsAction,
// prevTodoListDetails: prevTodoListDetailsReducer,   PrevTodoListDetailsAction,


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
/*
export function todoListsReducer(state: TodoListModel[], action: LoadTodoListsAction | OpenCloseTodoListAction): TodoListModel[] {
  switch (action.type) {
    case TodoListActionTypes.LoadTodoListsAction:
      return action.payload;
    case TodoListActionTypes.OpenTodoListAction:
      console.log('In todoListsReducer, state = ', state);
      const updatedList = {...state[action.payload], showListDetails: !state[action.payload].showListDetails};
      console.log('In todoListsReducer, updatedList = ', updatedList);
      return [ ...state.slice(0, action.payload), updatedList, ...state.slice(action.payload + 1)];
    default:
      return state;
  }
} */

export function prevTodoListsReducer(state: TodoListModel[], action: PrevTodoListsAction): TodoListModel[] {
  switch (action.type) {
    case TodoListActionTypes.PrevTodoListsAction:
      return action.payload;
    default:
      return state;
  }
}
/*
export function todoListDetailsReducer(state: TodoListModel, action: TodoListDetailsAction): TodoListModel {
  switch (action.type) {
    case TodoListActionTypes.TodoListDetailsAction:
      return action.payload;
    default:
      return state;
  }
}

export function prevTodoListDetailsReducer(state: TodoListModel, action: PrevTodoListDetailsAction): TodoListModel {
  switch (action.type) {
    case TodoListActionTypes.PrevTodoListDetailsAction:
      return action.payload;
    default:
      return state;
  }
} */

export function creatingNewListReducer(state: boolean, action: CreateNewTodoListAction): boolean {
  switch (action.type) {
    case TodoListActionTypes.CreateNewTodoListAction:
      return action.payload;
    default:
      return state;
  }
}
/*
export function creatingNewTodoReducer(state: boolean, action: CreatingNewTodoAction): boolean {
  switch (action.type) {
    case CreatingNewListActionTypes.CreatingNewTodoAction:
      return action.payload;
    default:
      return state;
  }
} */

export function updateListDetailsLoadingReducer(state: boolean, action: UpdateListDetailsLoadingAction): boolean {
  switch (action.type) {
    case TodoListActionTypes.UpdateListDetailsLoadingAction:
      return action.payload;
    default:
      return state;
  }
}
