import { UserModel } from './user.model';
import { TodoListModel } from './todo-list.model';
import { LoginModel } from './login.model';

export const BASE_URL = 'https://os.hallpassandfriends.com';
export const SCOPE = '2bcf85b6-698d-4ab4-9910-ecb905b87828';

export interface APPStore {
  loginObject: LoginModel;
  todoLists: TodoListModel[];
  todoListDetails: TodoListModel;
  currentUser: UserModel;
}
