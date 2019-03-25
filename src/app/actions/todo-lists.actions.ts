import { Action } from '@ngrx/store';
import { TodoListModel } from '../models';

export enum TodoListsActionTypes {
  LoadTodoListsAction = 'LoadTodoListsAction',
  OpenCloseTodoListAction = 'OpenCloseTodoListAction',
  EditTodoListNameAction = 'EditTodoListNameAction',
  CreateNewTodoAction = 'CreateNewTodoAction',
  DeleteTodoListAction = 'DeleteTodoListAction',
  CreateNewTodoListAction = 'CreateNewTodoListAction',
  UpdateTodoListsWithUpdatedListItemsAction = 'UpdateTodoListsWithUpdatedListItemsAction',
}

export class LoadTodoListsAction implements Action {
  readonly type = TodoListsActionTypes.LoadTodoListsAction;

  constructor(public payload: TodoListModel[]) {}
}

export class OpenCloseTodoListAction implements Action {
  readonly type = TodoListsActionTypes.OpenCloseTodoListAction;

  constructor(public payload: { listIndex: number, listDetails: TodoListModel | null}) {}
}

export class EditTodoListNameAction implements Action {
  readonly type = TodoListsActionTypes.EditTodoListNameAction;

  constructor(public payload: { listIndex: number, listName: string | null, mode: string}) {}
}

export class CreateNewTodoAction implements Action {
  readonly type = TodoListsActionTypes.CreateNewTodoAction;

  constructor(public payload: number) {}
}

export class DeleteTodoListAction implements Action {
  readonly type = TodoListsActionTypes.DeleteTodoListAction;

  constructor(public payload: number) {}
}

export class CreateNewTodoListAction implements Action {
  readonly type = TodoListsActionTypes.CreateNewTodoListAction;

  constructor(public payload: boolean) {}
}

export class UpdateTodoListsWithUpdatedListItemsAction implements Action {
  readonly type = TodoListsActionTypes.UpdateTodoListsWithUpdatedListItemsAction;

  constructor(public payload: { listIndex: number, itemIndex: number, label: string | null, mode: string }) {}
}

