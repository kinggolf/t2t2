import { Action } from '@ngrx/store';

export enum CreatingNewListActionTypes {
  CreatingNewListAction = 'CreatingNewListAction',
}

export class CreatingNewListAction implements Action {
  readonly type = CreatingNewListActionTypes.CreatingNewListAction;

  constructor(public payload: boolean) {}
}
/*
  CreatingNewTodoAction = 'CreatingNewTodoAction',

export class CreatingNewTodoAction implements Action {
  readonly type = CreatingNewListActionTypes.CreatingNewTodoAction;

  constructor(public payload: boolean) {}
} */
