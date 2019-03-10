import { TodoModel } from './todo.model';

export interface TodoListModel {
  name: string;
  id?: string;
  note?: string;
  todos?: TodoModel[];
}
