import { Action } from '@ngrx/store';

export enum CreatingNewListActionTypes {
  CreatingNewListAction = 'CreatingNewListAction',
  CreatingNewTodoAction = 'CreatingNewTodoAction',
}

export class CreatingNewListAction implements Action {
  readonly type = CreatingNewListActionTypes.CreatingNewListAction;

  constructor(public payload: boolean) {}
}

export class CreatingNewTodoAction implements Action {
  readonly type = CreatingNewListActionTypes.CreatingNewTodoAction;

  constructor(public payload: boolean) {}
}
