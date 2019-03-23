import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { APPStore, UserModel, LoginModel, TodoListModel } from './models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from './services/todos.service';
import { LoadTodoListsAction, UserAction, CreateNewTodoListAction } from './actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: UserModel;
  loginSub: SubscriptionLike;
  currentUserSub: SubscriptionLike;
  todoListsFromServerSub: SubscriptionLike;
  newListName: string;
  showTotoListsLoadingSpinner: boolean;
  todoLists: TodoListModel[];
  prevTodoLists: TodoListModel[];

  constructor(private authService: AuthService, private todosService: TodosService, private store: Store<APPStore>) {}

  ngOnInit(): void {
    this.showTotoListsLoadingSpinner = false;
    const currentUserFromLocalStorage = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUserFromLocalStorage && (typeof currentUserFromLocalStorage !== 'undefined')) {
      // No need for log in, but when do we need to refresh the token, app restart?
      this.store.dispatch(new UserAction(currentUserFromLocalStorage));
    }
    this.currentUserSub = this.store.select('currentUser').subscribe(user => {
      this.currentUser = user;
      if (this.currentUser && (typeof this.currentUser !== 'undefined')) {
        if (this.currentUser.token) {
          this.showTotoListsLoadingSpinner = true;
          this.todoListsFromServerSub = this.todosService.getTodoLists().subscribe(todoLists => {
            if (todoLists) {
              this.todoLists = todoLists;
              this.store.dispatch(new LoadTodoListsAction(todoLists));
              this.showTotoListsLoadingSpinner = false;
            }
          },
            error => {
              if (error.statusText === 'Unauthorized') {
                this.showTotoListsLoadingSpinner = false;
                this.currentUser = null;
              }
          });
        }
      }
    });
    this.loginSub = this.store.select<LoginModel>('loginObject').subscribe(loginObject => {
      if (loginObject) {
        this.authService.submitLogin(loginObject);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    if (this.todoListsFromServerSub) {
      this.todoListsFromServerSub.unsubscribe();
    }
  }

  createNewList(): void {
    this.prevTodoLists = this.todoLists.slice(0);
    this.store.dispatch(new CreateNewTodoListAction(true));
  }

  logout(): void {
    const confirmLogout = window.confirm('Confirm Logout');
    if (confirmLogout) {
      this.authService.logout();
    }
  }
}
