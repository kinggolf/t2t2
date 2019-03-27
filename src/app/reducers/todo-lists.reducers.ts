import {TodoListModel} from '../models';
import { LoadTodoListsAction, OpenCloseTodoListAction, EditTodoListNameAction, CreateNewTodoAction, DeleteTodoListAction,
         CreateNewTodoListAction, UpdateTodoListsWithUpdatedListItemsAction, TodoListsActionTypes } from '../actions';

export function todoListsReducer(
  state: TodoListModel[],
  action: LoadTodoListsAction | OpenCloseTodoListAction | CreateNewTodoListAction | DeleteTodoListAction |
          CreateNewTodoAction | EditTodoListNameAction | UpdateTodoListsWithUpdatedListItemsAction): TodoListModel[] {
  let i = 0;
  let updatedList;
  let updatedListItems;
  let completedCount;
  let pendingCount;
  let listIndex;
  let itemIndex;
  switch (action.type) {

    case TodoListsActionTypes.LoadTodoListsAction:
      return action.payload;

    case TodoListsActionTypes.OpenCloseTodoListAction:
      listIndex = action.payload.listIndex;
      state.map(list => {
        state[i].showListDetails = false;
        i++;
      });
      if (action.payload.listDetails) {
        updatedList = {
          ...action.payload.listDetails,
          showListDetails: !state[listIndex].showListDetails,
          itemsCompleted: state[listIndex].itemsCompleted,
          itemsPending: state[listIndex].itemsPending,
        };
        return [ ...state.slice(0, action.payload.listIndex), updatedList, ...state.slice(action.payload.listIndex + 1)];
      } else {
        return state;
      }

    case TodoListsActionTypes.EditTodoListNameAction:
      listIndex = action.payload.listIndex;
      state.map(() => {
        state[i].editingName = false;
        state[i].showListDetails = false;
        i++;
      });
      if (action.payload.mode === 'edit') {
        updatedList = { ...state[listIndex], editingName: true, name: state[listIndex].name };
        return [ ...state.slice(0, listIndex), updatedList, ...state.slice(listIndex + 1)];
      } else if (action.payload.mode === 'cancel') {
        return [ ...state.slice(0) ];
      } else {
        // Saving list name edit
        updatedList = { ...state[listIndex], name: action.payload.listName };
        return [ ...state.slice(0, listIndex), updatedList, ...state.slice(listIndex + 1)];
      }

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

    case TodoListsActionTypes.CreateNewTodoAction:
      listIndex = action.payload;
      const newTodo = { id: '', label: '', completed: false, editingLabel: true };
      updatedList = { ...state[listIndex], items: [ newTodo, ...state[listIndex].items ] };
      return [ ...state.slice(0, listIndex), updatedList, ...state.slice(listIndex + 1) ];

    case TodoListsActionTypes.UpdateTodoListsWithUpdatedListItemsAction:
      listIndex = action.payload.listIndex;
      itemIndex = action.payload.itemIndex;
      if (action.payload.mode === 'editLabel') {
        completedCount = state[listIndex].itemsCompleted;
        pendingCount = state[listIndex].itemsPending;
        updatedListItems = [
          ...state[listIndex].items.slice(0, itemIndex),
          { ...state[listIndex].items[itemIndex], label: action.payload.label },
          ...state[listIndex].items.slice(itemIndex + 1)
        ];
      } else if (action.payload.mode === 'cancelEditLabel') {
        updatedListItems = [
          ...state[listIndex].items.slice(0, itemIndex),
          ...state[listIndex].items.slice(itemIndex + 1)
        ];

      } else if (action.payload.mode === 'creatingItem') {
        completedCount = state[listIndex].itemsCompleted;
        if (state[listIndex].itemsPending) {
          pendingCount = state[listIndex].itemsPending + 1;
        } else {
          pendingCount = 1;
        }
        updatedListItems = [
          ...state[listIndex].items.slice(0, itemIndex),
          { ...state[listIndex].items[itemIndex], itemsCompleted: completedCount, itemsPending: pendingCount },
          ...state[listIndex].items.slice(itemIndex + 1)
        ];
      } else if (action.payload.mode === 'toggleComplete') {
        const itemCompleted = state[listIndex].items[itemIndex].completed;
        if (itemCompleted) {
          completedCount = state[listIndex].itemsCompleted - 1;
          pendingCount = state[listIndex].itemsPending + 1;
        } else {
          completedCount = state[listIndex].itemsCompleted + 1;
          pendingCount = state[listIndex].itemsPending - 1;
        }
        updatedListItems = [
          ...state[listIndex].items.slice(0, itemIndex),
          { ...state[listIndex].items[itemIndex], completed: !itemCompleted, itemsCompleted: completedCount, itemsPending: pendingCount },
          ...state[listIndex].items.slice(itemIndex + 1)
        ];
      } else {
        // Deleting an item
        if (state[listIndex].items[itemIndex].completed) {
          completedCount = state[listIndex].itemsCompleted - 1;
          pendingCount = state[listIndex].itemsPending;
        } else {
          completedCount = state[listIndex].itemsCompleted;
          pendingCount = state[listIndex].itemsPending - 1;
        }
        updatedListItems = [ ...state[listIndex].items.slice(0, itemIndex), ...state[listIndex].items.slice(itemIndex + 1) ];
      }
      updatedList = { ...state[listIndex], items: updatedListItems, itemsCompleted: completedCount, itemsPending: pendingCount };
      return [ ...state.slice(0, listIndex), updatedList, ...state.slice(listIndex + 1) ];

    default:
      return state;
  }
}

