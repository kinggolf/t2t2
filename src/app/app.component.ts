import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { APPStore, UserModel, TodoListModel, TodoModel, LoginModel } from './models';
import { SubscriptionLike } from 'rxjs';
import { Store } from '@ngrx/store';
import { TodosService } from './services/todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: UserModel;
  todoLists: TodoListModel[];
  todos: TodoModel[];
  loginSub: SubscriptionLike;
  todoListsSub: SubscriptionLike;

  constructor(private authService: AuthService, private todosService: TodosService, private store: Store<APPStore>) {}

  ngOnInit(): void {
    this.currentUser = null;
    // this.todosService.getTodoLists().subscribe(resp => {
    //   this.todoLists = resp;
    // });
    this.loginSub = this.store.select<LoginModel>('loginObject').subscribe(loginObject => {
      // this.loginSub = this.store.select<LoginModel>(state => state.loginObject).subscribe(loginObject => {
      if (loginObject) {
        this.authService.submitLogin(loginObject);
      }
    });
    /*
    this.todoListsSub = this.store.select<TodoListModel[]>('todoLists').subscribe(todolists => {
      if (todolists) {
        console.log(todolists);
      }
    });
    this.todosService.getTodoLists(); */
    this.todoListsSub = this.todosService.getTodoLists().subscribe(todolists => {
        if (todolists) {
          console.log(todolists);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
    this.todoListsSub.unsubscribe();
  }

  /*
  submitLogin(loginObject) {
    console.log('In AppComponent, loginObject = ', loginObject);
    this.authService.submitLogin(loginObject);
  } */

  getTodosOfList(listId) {
    this.todosService.getTodos(listId).subscribe(resp => {
      this.todos = resp;
    });
  }
}
