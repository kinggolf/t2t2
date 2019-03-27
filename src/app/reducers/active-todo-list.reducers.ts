import {TodoListModel} from '../models';
import { ActiveTodoListActionTypes, DeleteTodoAction, EditTodoLabelAction,
         LoadActiveTodoListAction, ToggleTodoCompleteAction } from '../actions';

export function activeTodoListReducer(
  state: TodoListModel,
  action: LoadActiveTodoListAction | EditTodoLabelAction | DeleteTodoAction | ToggleTodoCompleteAction ): TodoListModel {
  let i = 0;
  let updatedActiveListItems;
  let updatedItem;
  let itemIndex;
  switch (action.type) {

    case ActiveTodoListActionTypes.LoadActiveTodoListAction:
      return action.payload;

    case ActiveTodoListActionTypes.EditTodoLabelAction:
      itemIndex = action.payload.itemIndex;
      state.items.map(() => {
        state.items[i].editingLabel = false;
        i++;
      });
      if (action.payload.mode === 'edit') {
        updatedItem = { ...state.items[itemIndex], editingLabel: true, label: state.items[itemIndex].label};
        updatedActiveListItems = [ ...state.items.slice(0, itemIndex), updatedItem, ...state.items.slice(itemIndex + 1) ];
        return { ...state, items: updatedActiveListItems };
      } else if (action.payload.mode === 'cancel') {
        return { ...state };
      } else {
        // This is from save, either creating a new item or editing label of an existing item
        if (action.payload.newList) {
          return { ...action.payload.newList };
        } else {
          updatedItem = { ...state.items[itemIndex], editingLabel: false, label: action.payload.itemLabel };
          updatedActiveListItems = [...state.items.slice(0, itemIndex), updatedItem, ...state.items.slice(itemIndex + 1)];
          return { ...state, items: updatedActiveListItems };
        }
      }

    case ActiveTodoListActionTypes.DeleteTodoAction:
      itemIndex = action.payload;
      return { ...state, items: [ ...state.items.slice(0, itemIndex), ...state.items.slice(itemIndex + 1) ] };

    case ActiveTodoListActionTypes.ToggleTodoCompleteAction:
      itemIndex = action.payload;
      updatedItem = { ...state.items[itemIndex], completed: !state.items[itemIndex].completed };
      return { ...state, items: [ ...state.items.slice(0, itemIndex), updatedItem, ...state.items.slice(itemIndex + 1) ] };

    default:
      return state;
  }
}
