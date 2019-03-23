import { TodoListModel } from '../models';
import { LoadTodoListsAction, OpenCloseTodoListAction, EditTodoListNameAction, DeleteTodoListAction,
         AddTodoToListAction, PrevTodoListsAction, TodoListActionTypes } from '../actions';

export function todoListsReducer(
  state: TodoListModel[],
  action: LoadTodoListsAction | OpenCloseTodoListAction | EditTodoListNameAction | DeleteTodoListAction): TodoListModel[] {
  switch (action.type) {
    case TodoListActionTypes.LoadTodoListsAction:
      return action.payload;
    case TodoListActionTypes.OpenTodoListAction:
      const listIndex = action.payload.listIndex;
      console.log('In todoListsReducer, state = ', state);
      // If opening a list, then iterate through all lists and close - two lists cannot be open at same time.
      if (!state[listIndex].showListDetails) {
        state.map(list => {
          list.showListDetails = false;
        });
      }
      const updatedList = {...action.payload.listDetails, showListDetails: !state[listIndex].showListDetails};
      // const updatedList = {...state[listIndex], showListDetails: !state[listIndex].showListDetails};
      console.log('In todoListsReducer, updatedList = ', updatedList);
      return [ ...state.slice(0, listIndex), updatedList, ...state.slice(listIndex + 1)];
    case TodoListActionTypes.EditTodoListNameAction:

    default:
      return state;
  }
}

export function prevTodoListsReducer(state: TodoListModel[], action: PrevTodoListsAction): TodoListModel[] {
  switch (action.type) {
    case TodoListActionTypes.PrevTodoListsAction:
      return action.payload;
    default:
      return state;
  }
}

