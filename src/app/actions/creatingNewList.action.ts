import { Action } from '@ngrx/store';

export enum CreatingNewListActionTypes {
  CreatingNewListAction = 'CreatingNewListAction',
}

export class CreatingNewListAction implements Action {
  readonly type = CreatingNewListActionTypes.CreatingNewListAction;

  constructor(public payload: boolean) {}
}
