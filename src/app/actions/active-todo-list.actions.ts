import { Action } from '@ngrx/store';
import { TodoListModel } from '../models';

export enum ActiveTodoListActionTypes {
  LoadActiveTodoListAction = 'LoadActiveTodoListAction',
  EditTodoLabelAction = 'EditTodoLabelAction',
  DeleteTodoAction = 'DeleteTodoAction',
  // CreateNewTodoAction = 'CreateNewTodoAction',
  ToggleTodoAction = 'ToggleTodoAction',
}

export class LoadActiveTodoListAction implements Action {
  readonly type = ActiveTodoListActionTypes.LoadActiveTodoListAction;

  constructor(public payload: TodoListModel) {}
}

// Todo eliminate listIndex: number below?
export class EditTodoLabelAction implements Action {
  readonly type = ActiveTodoListActionTypes.EditTodoLabelAction;

  constructor(public payload: { listIndex: number, itemIndex: number,  itemLabel: string | null, mode: string }) {}
}

export class DeleteTodoAction implements Action {
  readonly type = ActiveTodoListActionTypes.DeleteTodoAction;

  constructor(public payload: number) {}
}

/*
export class CreateNewTodoAction implements Action {
  readonly type = ActiveTodoListActionTypes.CreateNewTodoAction;

  constructor(public payload: number) {}
} */

export class ToggleTodoAction implements Action {
  readonly type = ActiveTodoListActionTypes.ToggleTodoAction;

  constructor(public payload: number) {}
}

