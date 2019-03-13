import { Action } from '@ngrx/store';
import { TodoListModel } from '../models';

export enum TodoListActionTypes {
  TodoListsAction = 'TodoListsAction',
  PrevTodoListsAction = 'PrevTodoListsAction',
  TodoListDetailsAction = 'TodoListDetailsAction',
  PrevTodoListDetailsAction = 'PrevTodoListDetailsAction',
  UpdateTodosForListAction = 'UpdateTodosForListAction',
  UpdateListDetailsLoadingAction = 'UpdateListDetailsLoadingAction',
}

export class TodoListsAction implements Action {
  readonly type = TodoListActionTypes.TodoListsAction;

  constructor(public payload: TodoListModel[]) {}
}

export class PrevTodoListsAction implements Action {
  readonly type = TodoListActionTypes.PrevTodoListsAction;

  constructor(public payload: TodoListModel[]) {}
}

export class TodoListDetailsAction implements Action {
  readonly type = TodoListActionTypes.TodoListDetailsAction;

  constructor(public payload: TodoListModel) {}
}

export class PrevTodoListDetailsAction implements Action {
  readonly type = TodoListActionTypes.PrevTodoListDetailsAction;

  constructor(public payload: TodoListModel) {}
}

export class UpdateTodosForListAction implements Action {
  readonly type = TodoListActionTypes.UpdateTodosForListAction;

  constructor(public payload: TodoListModel[]) {}
}

export class UpdateListDetailsLoadingAction implements Action {
  readonly type = TodoListActionTypes.UpdateListDetailsLoadingAction;

  constructor(public payload: boolean) {}
}
