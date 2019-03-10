import { UserModel } from './user.model';
import { TodoListModel } from './todo-list.model';
import { LoginModel } from './login.model';
// user: UserModel;

export interface APPStore {
  loginObject: LoginModel;
  todoLists: TodoListModel[];
}
