import { TodoListModel } from '../models';
import { LoadTodoListsAction, EditTodoListNameAction, CreateNewTodoListAction, DeleteTodoListAction, OpenCloseTodoListAction,
         TodoListActionTypes } from '../actions';

export function todoListsReducer(
  state: TodoListModel[],
  action: LoadTodoListsAction | OpenCloseTodoListAction | CreateNewTodoListAction | DeleteTodoListAction |
          EditTodoListNameAction): TodoListModel[] {
  let i = 0;
  let updatedList;
  switch (action.type) {
    case TodoListActionTypes.LoadTodoListsAction:
      return action.payload;
    case TodoListActionTypes.OpenCloseTodoListAction:
      state.map(list => {
        state[i].showListDetails = false;
        i++;
      });
      if (action.payload.listDetails) {
        updatedList = {
          ...action.payload.listDetails,
          showListDetails: !state[action.payload.listIndex].showListDetails,
          itemsCompleted: state[action.payload.listIndex].itemsCompleted,
          itemsPending: state[action.payload.listIndex].itemsPending,
        };
        return [ ...state.slice(0, action.payload.listIndex), updatedList, ...state.slice(action.payload.listIndex + 1)];
      } else {
        return state;
      }
    case TodoListActionTypes.EditTodoListNameAction:
      state.map(() => {
        state[i].editingName = false;
        state[i].showListDetails = false;
        i++;
      });
      if (action.payload.mode === 'edit') {
        updatedList = {
          ...state[action.payload.listIndex],
          editingName: true,
          name: state[action.payload.listIndex].name
        };
        return [ ...state.slice(0, action.payload.listIndex), updatedList, ...state.slice(action.payload.listIndex + 1)];
      } else if (action.payload.mode === 'cancel') {
        return [ ...state.slice(0)];
      } else {
        updatedList = {
          ...state[action.payload.listIndex],
          name: action.payload.listName
        };
        return [ ...state.slice(0, action.payload.listIndex), updatedList, ...state.slice(action.payload.listIndex + 1)];
      }
    case TodoListActionTypes.CreateNewTodoListAction:
      state.map(() => {
        state[i].editingName = false;
        state[i].showListDetails = false;
        i++;
      });
      const newTodoList = [ { id: '', name: '', itemsPending: 0, itemsCompleted: 0, editingName: true, creatingNewList: true } ];
      return [ ...newTodoList, ...state.slice(0) ];
    default:
      return state;
  }
}

