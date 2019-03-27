import { ActionReducerMap } from '@ngrx/store';
import { APPStore } from '../models';
import { userReducer } from './user.reducers';
import { todoListsReducer } from './todo-lists.reducers';
import { activeTodoListReducer } from './active-todo-list.reducers';

export const reducers: ActionReducerMap<APPStore> = {
  currentUser: userReducer,
  todoLists: todoListsReducer,
  activeTodoList: activeTodoListReducer,
};
