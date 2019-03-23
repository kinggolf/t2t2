import { Action } from '@ngrx/store';
import { TodoListModel, TodoModel } from '../models';

export enum TodoListActionTypes {
  LoadTodoListsAction = 'LoadTodoListsAction',
  OpenCloseTodoListAction = 'OpenCloseTodoListAction',
  EditTodoListNameAction = 'EditTodoListNameAction',
  DeleteTodoListAction = 'DeleteTodoListAction',
  CreateNewTodoListAction = 'CreateNewTodoListAction',
  AddTodoToListAction = 'AddTodoToListAction',
  UpdateTodosForListAction = 'UpdateTodosForListAction',
  UpdateListDetailsLoadingAction = 'UpdateListDetailsLoadingAction',
}

export class LoadTodoListsAction implements Action {
  readonly type = TodoListActionTypes.LoadTodoListsAction;

  constructor(public payload: TodoListModel[]) {}
}

export class OpenCloseTodoListAction implements Action {
  readonly type = TodoListActionTypes.OpenCloseTodoListAction;

  constructor(public payload: { listIndex: number, listDetails: TodoListModel | null}) {}
}

export class EditTodoListNameAction implements Action {
  readonly type = TodoListActionTypes.EditTodoListNameAction;

  constructor(public payload: { listIndex: number, listName: string | null, mode: string}) {}
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

export class UpdateTodosForListAction implements Action {
  readonly type = TodoListActionTypes.UpdateTodosForListAction;

  constructor(public payload: TodoListModel[]) {}
}

export class UpdateListDetailsLoadingAction implements Action {
  readonly type = TodoListActionTypes.UpdateListDetailsLoadingAction;

  constructor(public payload: boolean) {}
}
