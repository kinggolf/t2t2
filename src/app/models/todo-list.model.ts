import { TodoModel } from './todo.model';

export interface TodoListModel {
  todos?: TodoModel[];
  todoListDocId?: string;
  listName: string;
  itemsCompleted?: number;
  itemsPending?: number;
  orderIndex?: number;
}
