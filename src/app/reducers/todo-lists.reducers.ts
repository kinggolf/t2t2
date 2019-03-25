import {TodoListModel} from '../models';
import { LoadTodoListsAction, OpenCloseTodoListAction, EditTodoListNameAction, CreateNewTodoAction, DeleteTodoListAction,
         CreateNewTodoListAction, UpdateTodoListsWithUpdatedListItemsAction, TodoListsActionTypes } from '../actions';

export function todoListsReducer(
  state: TodoListModel[],
  action: LoadTodoListsAction | OpenCloseTodoListAction | CreateNewTodoListAction | CreateNewTodoAction |
          DeleteTodoListAction | EditTodoListNameAction | UpdateTodoListsWithUpdatedListItemsAction): TodoListModel[] {
  let i = 0;
  let updatedList;
  switch (action.type) {

    case TodoListsActionTypes.LoadTodoListsAction:
      return action.payload;

    case TodoListsActionTypes.OpenCloseTodoListAction:
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

    case TodoListsActionTypes.EditTodoListNameAction:
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

    case TodoListsActionTypes.CreateNewTodoAction:
      const newTodo = { id: '', label: '', completed: false, editingLabel: true };
      updatedList = { ...state[action.payload], items: [ newTodo, ...state[action.payload].items ] };
      console.log('In reducers, CreateNewTodoAction: updatedList = ', updatedList);
      return [ ...state.slice(0, action.payload), updatedList, ...state.slice(action.payload + 1) ];

    case TodoListsActionTypes.CreateNewTodoListAction:
      state.map(() => {
        state[i].editingName = false;
        state[i].showListDetails = false;
        i++;
      });
      const newTodoList = [ { id: '', name: '', itemsPending: 0, itemsCompleted: 0, editingName: true, creatingNewList: true } ];
      return [ ...newTodoList, ...state.slice(0) ];

    case TodoListsActionTypes.DeleteTodoListAction:
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];

    case TodoListsActionTypes.UpdateTodoListsWithUpdatedListItemsAction:
      if (action.payload.mode === 'editLabel' || action.payload.mode === 'toggleComplete') {
        updatedList = { ...state[action.payload.listIndex], items: action.payload.updatedListItems };
        return [ ...state.slice(0, action.payload.listIndex), updatedList, ...state.slice(action.payload.listIndex + 1) ];
      } else {
        // Deleting a todoItem
        return [ ...state.slice(0, action.payload.listIndex), ...state.slice(action.payload.listIndex + 1) ];
      }

    default:
      return state;
  }
}

