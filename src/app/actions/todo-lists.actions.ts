import { Action } from '@ngrx/store';
import { TodoListModel, TodoModel } from '../models';

export enum TodoListActionTypes {
  LoadTodoListsAction = 'LoadTodoListsAction',
  UpdateTodosForListAction = 'UpdateTodosForListAction',
  UpdateListDetailsLoadingAction = 'UpdateListDetailsLoadingAction',
  OpenTodoListAction = 'OpenTodoListAction',
  EditTodoListNameAction = 'EditTodoListNameAction',
  DeleteTodoListAction = 'DeleteTodoListAction',
  CreateNewTodoListAction = 'CreateNewTodoListAction',
  AddTodoToListAction = 'AddTodoToListAction',
  PrevTodoListsAction = 'PrevTodoListsAction',
}

export class LoadTodoListsAction implements Action {
  readonly type = TodoListActionTypes.LoadTodoListsAction;

  constructor(public payload: TodoListModel[]) {}
}

export class OpenCloseTodoListAction implements Action {
  readonly type = TodoListActionTypes.OpenTodoListAction;

  constructor(public payload: { listIndex: number, listDetails: TodoListModel | null}) {}
}

export class EditTodoListNameAction implements Action {
  readonly type = TodoListActionTypes.EditTodoListNameAction;

  constructor(public payload: number) {}
}

export class DeleteTodoListAction implements Action {
  readonly type = TodoListActionTypes.DeleteTodoListAction;

  constructor(public payload: number) {}
}

export class CreateNewTodoListAction implements Action {
  readonly type = TodoListActionTypes.CreateNewTodoListAction;

  constructor(public payload: boolean) {}
}

export class AddTodoToListAction implements Action {
  readonly type = TodoListActionTypes.AddTodoToListAction;

  constructor(public payload: TodoModel) {}
}

export class PrevTodoListsAction implements Action {
  readonly type = TodoListActionTypes.PrevTodoListsAction;

  constructor(public payload: TodoListModel[]) {}
}

/*
  LoadingTodoListsAction = 'LoadingTodoListsAction',

export class LoadingTodoListsAction implements Action {
  readonly type = TodoListActionTypes.LoadingTodoListsAction;

  constructor(public payload: TodoListModel[]) {}
} */



export class UpdateTodosForListAction implements Action {
  readonly type = TodoListActionTypes.UpdateTodosForListAction;

  constructor(public payload: TodoListModel[]) {}
}

export class UpdateListDetailsLoadingAction implements Action {
  readonly type = TodoListActionTypes.UpdateListDetailsLoadingAction;

  constructor(public payload: boolean) {}
}
