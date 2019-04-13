import { TodoListModel } from './todo-list.model';

export interface UserModel {
  email: string;
  firstName: string;
  lastName: string;
  todoLists?: TodoListModel[];
  userDocId?: string;
  userUID: string;
}
