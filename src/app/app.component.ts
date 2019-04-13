import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoListModel } from './models';
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
  todoLists: TodoListModel[];
  isOnline$: Observable<boolean>;

  constructor(private firestoreService: FirestoreService, private todosService: TodosService,
              private appHealthService: AppHealthService) {}

  ngOnInit(): void {
    this.currentUserSub = this.firestoreService.getUser().subscribe(user => {
      this.currentUser = user;
      console.log('this.currentUser = ', this.currentUser);
    });
    this.firestoreService.initAuthState();
    this.isOnline$ = this.appHealthService.monitorOnline();
  }

  ngOnDestroy(): void {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
  }

}
