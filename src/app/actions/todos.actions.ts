import { Action } from '@ngrx/store';
import { TodoListModel, TodoModel } from '../models';

export enum TodosActionTypes {
  EditTodoLabelAction = 'EditTodoLabelAction',
  DeleteTodoAction = 'DeleteTodoAction',
  ToggleTodoCompleteAction = 'ToggleTodoCompleteAction',
}
/*
  LoadTodosAction = 'LoadTodosAction',
export class LoadTodosAction implements Action {
  readonly type = TodosActionTypes.LoadTodosAction;

  constructor(public payload: TodoListModel) {}
} */

export class EditTodoLabelAction implements Action {
  readonly type = TodosActionTypes.EditTodoLabelAction;

  constructor(public payload: number) {}
}

export class DeleteTodoAction implements Action {
  readonly type = TodosActionTypes.DeleteTodoAction;

  constructor(public payload: number) {}
}

export class ToggleTodoCompleteAction implements Action {
  readonly type = TodosActionTypes.ToggleTodoCompleteAction;

  constructor(public payload: number) {}
}
