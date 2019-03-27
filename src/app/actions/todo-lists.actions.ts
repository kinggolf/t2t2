import { Action } from '@ngrx/store';
import { TodoListModel } from '../models';

export enum TodoListsActionTypes {
  LoadTodoListsAction = 'LoadTodoListsAction',
  OpenCloseOrUpdateTodoListAction = 'OpenCloseOrUpdateTodoListAction',
  EditTodoListNameAction = 'EditTodoListNameAction',
  CreateNewTodoListAction = 'CreateNewTodoListAction',
  DeleteTodoListAction = 'DeleteTodoListAction',
  CreateNewTodoAction = 'CreateNewTodoAction',
  UpdateTodoListsWithUpdatedListItemsAction = 'UpdateTodoListsWithUpdatedListItemsAction',
}

export class LoadTodoListsAction implements Action {
  readonly type = TodoListsActionTypes.LoadTodoListsAction;

  constructor(public payload: TodoListModel[]) {}
}

export class OpenCloseOrUpdateTodoListAction implements Action {
  readonly type = TodoListsActionTypes.OpenCloseOrUpdateTodoListAction;

  constructor(public payload: { listIndex: number, openOrClose: boolean, listDetails: TodoListModel | null}) {}
}

export class EditTodoListNameAction implements Action {
  readonly type = TodoListsActionTypes.EditTodoListNameAction;

  constructor(public payload: { listIndex: number, listName: string | null, mode: string}) {}
}

export class CreateNewTodoListAction implements Action {
  readonly type = TodoListsActionTypes.CreateNewTodoListAction;

  constructor(public payload: boolean) {}
}

export class DeleteTodoListAction implements Action {
  readonly type = TodoListsActionTypes.DeleteTodoListAction;

  constructor(public payload: number) {}
}

export class CreateNewTodoAction implements Action {
  readonly type = TodoListsActionTypes.CreateNewTodoAction;

  constructor(public payload: number) {}
}

export class UpdateTodoListsWithUpdatedListItemsAction implements Action {
  readonly type = TodoListsActionTypes.UpdateTodoListsWithUpdatedListItemsAction;

  constructor(public payload: { listIndex: number, itemIndex: number, label: string | null, mode: string }) {}
}

