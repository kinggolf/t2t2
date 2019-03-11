import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { APPStore, UserModel, LoginModel } from './models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from './services/todos.service';
import {TodoListsAction, UserAction} from './actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: UserModel;
  loginSub: SubscriptionLike;
  currentUserSub: SubscriptionLike;
  todoListsSub: SubscriptionLike;

  constructor(private authService: AuthService, private todosService: TodosService, private store: Store<APPStore>) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser && (typeof this.currentUser !== 'undefined')) {
      // No need for log in, but when do we need to refresh the token?
      this.store.dispatch(new UserAction(this.currentUser));
      this.setupTodoLists();
    } else {
      this.loginSub = this.store.select<LoginModel>('loginObject').subscribe(loginObject => {
        if (loginObject) {
          this.authService.submitLogin(loginObject);
        }
      });
      this.currentUserSub = this.store.select('currentUser').subscribe(user => {
        this.currentUser = user;
        if (this.currentUser && (typeof this.currentUser !== 'undefined')) {
          if (this.currentUser.token) {
            this.setupTodoLists();
          }
        }
      });
    }
  }

  setupTodoLists() {
    this.todoListsSub = this.todosService.getTodoLists().subscribe(todolists => {
      if (todolists) {
        this.store.dispatch(new TodoListsAction(todolists));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    if (this.todoListsSub) {
      this.todoListsSub.unsubscribe();
    }
  }
}
