import {TodoListModel} from '../models';
import { LoadTodoListsAction, OpenCloseOrUpdateTodoListAction, EditTodoListNameAction, CreateNewTodoAction, DeleteTodoListAction,
         CreateNewTodoListAction, UpdateTodoListsWithUpdatedListItemsAction, TodoListsActionTypes } from '../actions';

export function todoListsReducer(
  state: TodoListModel[],
  action: LoadTodoListsAction | OpenCloseOrUpdateTodoListAction | CreateNewTodoListAction | DeleteTodoListAction |
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

    case TodoListsActionTypes.OpenCloseOrUpdateTodoListAction:
      listIndex = action.payload.listIndex;
      if (action.payload.openOrClose) {
        state.map(() => {
          state[i].showListDetails = false;
          i++;
        });
      }
      if (action.payload.listDetails) {
        if (action.payload.openOrClose) {
          updatedList = {
            ...action.payload.listDetails,
            showListDetails: !state[listIndex].showListDetails,
            itemsCompleted: state[listIndex].itemsCompleted,
            itemsPending: state[listIndex].itemsPending,
          };
        } else {
          if (action.payload.listDetails.items) {
            completedCount = pendingCount = i = 0;
            action.payload.listDetails.items.map(item => {
              completedCount = completedCount + (item.completed ? 1 : 0);
              pendingCount = pendingCount + (!item.completed ? 1 : 0);
              i++;
            });
            updatedList = {
              ...action.payload.listDetails,
              showListDetails: true,
              itemsCompleted: completedCount,
              itemsPending: pendingCount,
            };
          } else {
            // From creating a new list
            updatedList = { ...action.payload.listDetails };
          }
        }
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
      } else if (action.payload.mode === 'toggleComplete') {
        const itemCompleted = state[listIndex].items[itemIndex].completed;
        completedCount = state[listIndex].itemsCompleted + (!itemCompleted ? 1 : -1);
        pendingCount = state[listIndex].itemsPending + (itemCompleted ? 1 : -1);
        updatedListItems = [
          ...state[listIndex].items.slice(0, itemIndex),
          { ...state[listIndex].items[itemIndex], completed: !itemCompleted, itemsCompleted: completedCount, itemsPending: pendingCount },
          ...state[listIndex].items.slice(itemIndex + 1)
        ];
      } else {
        // Deleting an item
        completedCount = state[listIndex].itemsCompleted - (state[listIndex].items[itemIndex].completed ? 1 : 0);
        pendingCount = state[listIndex].itemsPending - (!state[listIndex].items[itemIndex].completed ? 1 : 0);
        updatedListItems = [ ...state[listIndex].items.slice(0, itemIndex), ...state[listIndex].items.slice(itemIndex + 1) ];
      }
      updatedList = { ...state[listIndex], items: updatedListItems, itemsCompleted: completedCount, itemsPending: pendingCount };
      return [ ...state.slice(0, listIndex), updatedList, ...state.slice(listIndex + 1) ];

    default:
      return state;
  }
}

