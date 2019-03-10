import { Action } from '@ngrx/store';
import { TodoListModel } from '../models';

export enum TodoListActionTypes {
  TodoListAction = 'TodoListAction',
}

export class TodoListAction implements Action {
  readonly type = TodoListActionTypes.TodoListAction;

  constructor(public payload: TodoListModel[]) {}
}
