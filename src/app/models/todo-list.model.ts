import { TodoModel } from './todo.model';

export interface TodoListModel {
  todos?: TodoModel[];
  listName: string;
  userUID: string;
  itemsCompleted?: number;
  itemsPending?: number;
  showListTodos?: boolean;
  editingName?: boolean;
  addingTodo?: boolean;
  creatingNewList?: boolean;
}
