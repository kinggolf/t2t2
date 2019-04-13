import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserModel, TodoListModel } from './models';
import { SubscriptionLike, Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { FirestoreService } from './services/firestore.service';
import { TodosService } from './services/todos.service';
import { AppHealthService } from './services/app-health.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: firebase.User;
  currentUserSub: SubscriptionLike;
  todoListsFromServerSub: SubscriptionLike;
  newListName: string;
  showTotoListsLoadingSpinner: boolean;
  todoLists: TodoListModel[];
  prevTodoLists: TodoListModel[];
  creatingNewList: boolean;
  isOnline$: Observable<boolean>;

  constructor(private firestoreService: FirestoreService, private todosService: TodosService,
              private appHealthService: AppHealthService) {}

  ngOnInit(): void {
    this.showTotoListsLoadingSpinner = this.creatingNewList = false;
    this.currentUserSub = this.firestoreService.getUser().subscribe(user => {
      this.currentUser = user;
      console.log('this.currentUser = ', this.currentUser);
    });
    this.firestoreService.initAuthState();
    /*
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
    }); */
    this.isOnline$ = this.appHealthService.monitorOnline();
  }

  ngOnDestroy(): void {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
    if (this.todoListsFromServerSub) {
      this.todoListsFromServerSub.unsubscribe();
    }
  }

  createNewList(): void {
    this.creatingNewList = true;
    this.prevTodoLists = this.todoLists.slice(0);
  }


  logout(): void {
    const confirmLogout = window.confirm('Confirm Logout');
    if (confirmLogout) {
      this.firestoreService.authLogout();
    }
  }
}
