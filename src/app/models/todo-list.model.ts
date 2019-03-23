import { TodoModel } from './todo.model';

export interface TodoListModel {
  id: string;
  name: string;
  itemsPending: number;
  itemsCompleted: number;
  items?: TodoModel[];
  showListDetails?: boolean;
  editingName?: boolean;
  addingTodo?: boolean;
  creatingNewList?: boolean;
}
