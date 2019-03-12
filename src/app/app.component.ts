import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { APPStore, UserModel, LoginModel, TodoListModel } from './models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from './services/todos.service';
import { TodoListsAction, UserAction } from './actions';
import { MatDialog } from '@angular/material';


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
  prevTodoLists: TodoListModel[];
  // todoListsSub: SubscriptionLike;

  constructor(private authService: AuthService, private todosService: TodosService,
              private store: Store<APPStore>) {}

  ngOnInit(): void {
    this.currentUserSub = this.store.select('currentUser').subscribe(user => {
      this.currentUser = user;
      if (this.currentUser && (typeof this.currentUser !== 'undefined')) {
        if (this.currentUser.token) {
          this.todoListsFromServerSub = this.todosService.getTodoLists().subscribe(todoLists => {
            if (todoLists) {
              this.store.dispatch(new TodoListsAction(todoLists));
            }
          });
        }
      }
    });
    const currentUserFormLocalStorage = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUserFormLocalStorage && (typeof currentUserFormLocalStorage !== 'undefined')) {
      // No need for log in, but when do we need to refresh the token?
      this.store.dispatch(new UserAction(currentUserFormLocalStorage));
    } else {
      this.loginSub = this.store.select<LoginModel>('loginObject').subscribe(loginObject => {
        if (loginObject) {
          this.authService.submitLogin(loginObject);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    if (this.todoListsFromServerSub) {
      this.todoListsFromServerSub.unsubscribe();
    }
    /*
    if (this.todoListsSub) {
      this.todoListsSub.unsubscribe();
    } */
  }

  createNewList(): void {
    console.log('createNewList');
    this.store.select('todoLists').subscribe(todoLists => {
      this.prevTodoLists = Object.assign(todoLists);
    }).unsubscribe();
    const newTodoList = {
      id: '',
      name: '',
      itemsPending: 0,
      itemsCompleted: 0,
      editingName: true
    };
    this.store.dispatch(new TodoListsAction(this.prevTodoLists.concat(newTodoList)));
  }

  logout(): void {
    const confirmLogout = window.confirm('Confirm Logout');
    if (confirmLogout) {
      this.authService.logout();
    }
  }
}
