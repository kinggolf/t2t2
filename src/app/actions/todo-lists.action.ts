import { Action } from '@ngrx/store';
import { TodoListModel, TodoModel } from '../models';

export enum TodoListActionTypes {
  TodoListsAction = 'TodoListsAction',
  TodoListDetailsAction = 'TodoListDetailsAction',
  UpdateTodosForListAction = 'UpdateTodosForListAction',
}

export class TodoListsAction implements Action {
  readonly type = TodoListActionTypes.TodoListsAction;

  constructor(public payload: TodoListModel[]) {}
}

export class TodoListDetailsAction implements Action {
  readonly type = TodoListActionTypes.TodoListDetailsAction;

  constructor(public payload: TodoListModel) {}
}

export class UpdateTodosForListAction implements Action {
  readonly type = TodoListActionTypes.UpdateTodosForListAction;

  constructor(public payload: TodoListModel[]) {}
}
