import { Action } from '@ngrx/store';
import { TodoListModel } from '../models';

export enum ActiveTodoListActionTypes {
  LoadActiveTodoListAction = 'LoadActiveTodoListAction',
  EditTodoLabelAction = 'EditTodoLabelAction',
  DeleteTodoAction = 'DeleteTodoAction',
  ToggleTodoCompleteAction = 'ToggleTodoCompleteAction',
}

export class LoadActiveTodoListAction implements Action {
  readonly type = ActiveTodoListActionTypes.LoadActiveTodoListAction;

  constructor(public payload: TodoListModel) {}
}

export class EditTodoLabelAction implements Action {
  readonly type = ActiveTodoListActionTypes.EditTodoLabelAction;

  constructor(public payload: { itemIndex: number,  itemLabel: string | null, mode: string }) {}
}

export class DeleteTodoAction implements Action {
  readonly type = ActiveTodoListActionTypes.DeleteTodoAction;

  constructor(public payload: number) {}
}

export class ToggleTodoCompleteAction implements Action {
  readonly type = ActiveTodoListActionTypes.ToggleTodoCompleteAction;

  constructor(public payload: number) {}
}
