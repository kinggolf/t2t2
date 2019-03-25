import { TodoListModel } from '../models';
import { LoadActiveTodoListAction, EditTodoLabelAction, DeleteTodoAction, CreateNewTodoAction,
         ToggleTodoAction, ActiveTodoListActionTypes, } from '../actions';

export function activeTodoListReducer(
  state: TodoListModel,
  action: LoadActiveTodoListAction | EditTodoLabelAction | DeleteTodoAction | CreateNewTodoAction |
          ToggleTodoAction): TodoListModel {
  let i = 0;
  let updatedActiveListItems;
  let updatedTodo;
  switch (action.type) {

    case ActiveTodoListActionTypes.LoadActiveTodoListAction:
      return action.payload;

    case ActiveTodoListActionTypes.EditTodoLabelAction:
      const itemIndex = action.payload.itemIndex;
      state.items.map(() => {
        state.items[i].editingLabel = false;
        i++;
      });
      if (action.payload.mode === 'edit') {
        updatedTodo = { ...state.items[itemIndex], editingLabel: true, label: state.items[itemIndex].label};
        updatedActiveListItems = [ ...state.items.slice(0, itemIndex), updatedTodo, ...state.items.slice(itemIndex + 1) ];
        return { ...state, items: updatedActiveListItems  };
      } else if (action.payload.mode === 'cancel') {
        return { ...state };
      } else {
        updatedTodo = { ...state.items[itemIndex], editingLabel: false, label: action.payload.itemLabel};
        updatedActiveListItems = [ ...state.items.slice(0, itemIndex), updatedTodo, ...state.items.slice(itemIndex + 1) ];
        return { ...state, items: updatedActiveListItems  };
      }

    default:
      return state;
  }
}
