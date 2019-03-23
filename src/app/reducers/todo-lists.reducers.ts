import {TodoListModel, TodoModel} from '../models';
import {
  AddTodoToListAction,
  CreateNewTodoListAction,
  DeleteTodoListAction,
  EditTodoListNameAction,
  LoadTodoListsAction,
  OpenCloseTodoListAction,
  TodoListActionTypes
} from '../actions';

export function todoListsReducer(
  state: TodoListModel[],
  action: LoadTodoListsAction | OpenCloseTodoListAction | CreateNewTodoListAction | DeleteTodoListAction |
          EditTodoListNameAction | AddTodoToListAction): TodoListModel[] {
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

    case TodoListActionTypes.DeleteTodoListAction:
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];

    case TodoListActionTypes.CreateNewTodoToAction:
      state.map(() => {
        state[i].editingName = false;
        if (i === action.payload) {
          state[i].showListDetails = true;
          state[i].addingTodo = true;
        } else {
          state[i].showListDetails = false;
          state[i].addingTodo = false;
        }
        i++;
      });
      const newTodo: TodoModel[] = [ { id: '', label: '', completed: false, editingTask: true } ];
      // const updatedTodoListItems = [ ...newTodo, ...state[action.payload].items];
      console.log('...state[action.payload].items = ', ...state[action.payload].items);
      const updatedTodoList = { ...state[action.payload], items: [ ...newTodo, ...state[action.payload].items] };
      return [ ...state.slice(0, action.payload), updatedTodoList, ...state.slice(action.payload + 1)];

    /*
    const updatedTodoListItems = [ action.payload.newTodo, ...state[action.payload.listIndex].items];
    const updatedTodoList = { ...state[action.payload.listIndex], items: updatedTodoListItems };
    return [ ...state.slice(0, action.payload.listIndex), updatedTodoList, ...state.slice(action.payload.listIndex + 1)]; */

    default:
      return state;
  }
}

