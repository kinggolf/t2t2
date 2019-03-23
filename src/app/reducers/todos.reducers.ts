import { TodoModel, TodoListModel } from '../models';
import { LoadTodosAction, EditTodoLabelAction, DeleteTodoAction, ToggleTodoCompleteAction, TodosActionTypes } from '../actions';

export function todosReducer(
  state: TodoListModel,
  action: LoadTodosAction | EditTodoLabelAction | DeleteTodoAction | ToggleTodoCompleteAction): TodoListModel {
  switch (action.type) {
    case TodosActionTypes.LoadTodosAction:
      return action.payload;
    case TodosActionTypes.EditTodoLabelAction:
      return state;
    case TodosActionTypes.DeleteTodoAction:
      return state;
    case TodosActionTypes.ToggleTodoCompleteAction:
      return state;
    default:
      return state;
  }
}
/*
export function prevTodosReducer(state: TodoModel[], action: TodosActionTypes): TodoModel[] {
  switch (action.type) {
    case TodosActionTypes.PrevTodoListsAction:
      return action.payload;
    default:
      return state;
  }
} */

