import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { APPStore, UserModel, TodoModel, LoginModel } from './models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from './services/todos.service';
import { TodoListsAction } from './actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: UserModel;
  todos: TodoModel[];
  loginSub: SubscriptionLike;
  todoListsSub: SubscriptionLike;

  constructor(private authService: AuthService, private todosService: TodosService, private store: Store<APPStore>) {}

  ngOnInit(): void {
    this.currentUser = null;
    this.loginSub = this.store.select<LoginModel>('loginObject').subscribe(loginObject => {
      if (loginObject) {
        this.authService.submitLogin(loginObject);
      }
    });
    this.todoListsSub = this.todosService.getTodoLists().subscribe(todolists => {
        if (todolists) {
          console.log(todolists);
          this.store.dispatch(new TodoListsAction(todolists));
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
  }

  getTodosOfList(listId) {
    this.todosService.getTodoListDetails(listId).subscribe(resp => {
      this.todos = resp;
    });
  } */
}
