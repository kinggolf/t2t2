import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { TodoListModel, UserModel } from '../../models';
import { SubscriptionLike } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { AppHealthService } from '../../services/app-health.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-todo-lists',
  templateUrl: './todo-lists.component.html',
  styleUrls: ['./todo-lists.component.css']
})
export class TodoListsComponent implements OnInit, OnDestroy {
  userDetails: UserModel;
  userDetailsSub: SubscriptionLike;
  userTodoLists: TodoListModel[];
  userTodoListsSub: SubscriptionLike;
  isOnlineSub: SubscriptionLike;
  newTodoListNameForm: FormGroup;
  showTotoListsLoadingSpinner: boolean;
  isOnline: boolean;
  selectedTodoList: TodoListModel;
  @Input() userUID: string;
  prevTodoLists: TodoListModel[];
  creatingNewList: boolean;

  constructor(private firestoreService: FirestoreService, private appHealthService: AppHealthService,
              private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.showTotoListsLoadingSpinner = true;
    this.userDetailsSub = this.firestoreService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails[0];
      console.log('userDetails = ', this.userDetails);
      this.userTodoListsSub = this.firestoreService.getUserTodoLists().subscribe(userTodoLists => {
        if (userTodoLists) {
          this.showTotoListsLoadingSpinner = false;
        }
        this.userTodoLists = userTodoLists;
        console.log('userTodoLists = ', this.userTodoLists);
      });
      this.firestoreService.initUserTodoLists(this.userDetails.userDocId);
    });
    this.firestoreService.initUserDetails(this.userUID);
    this.newTodoListNameForm = this.fb.group({
      newListName: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    this.isOnline = true;
    let onlineChangeCount = 0;
    this.isOnlineSub = this.appHealthService.monitorOnline().subscribe(online => {
      this.isOnline = online;
      if (!online) {
        this.snackBar.open('You are now offline. Editing disabled.', 'Got it', {
          duration: 5000,
        });
      } else if (onlineChangeCount > 0) {
        this.snackBar.open('Back online. Editing enabled.', 'OK', {
          duration: 5000,
        });
      }
      onlineChangeCount++;
    });
  }

  ngOnDestroy(): void {
    if (this.userDetailsSub) {
      this.userDetailsSub.unsubscribe();
    }
    if (this.userTodoListsSub) {
      this.userTodoListsSub.unsubscribe();
    }
    if (this.isOnlineSub) {
      this.isOnlineSub.unsubscribe();
    }
  }

  showListDetails(i): void {
    if ((this.userTodoLists[i].itemsPending + this.userTodoLists[i].itemsCompleted) > 0) {
      this.userTodoLists[i].showListTodos = !this.userTodoLists[i].showListTodos;
      console.log('In showListDetails, i = ' + i + ' & this.userTodoLists[i] =', this.userTodoLists[i]);
    }
  }

  createNewList(): void {
    this.creatingNewList = true;
    this.firestoreService.createNewTodoList(this.userDetails.userDocId);
  }

  logout(): void {
    const confirmLogout = window.confirm('Confirm Logout');
    if (confirmLogout) {
      this.firestoreService.authLogout();
    }
  }

  editListName(i): void {
    this.newTodoListNameForm.setValue({ newListName: this.userTodoLists[i].listName });
    const updatedList = { ...this.userTodoLists[i], listName: this.newTodoListNameForm.value.newListName, editingName: true };
    this.firestoreService.updateTodoList(this.userDetails.userDocId, this.userTodoLists[i].todoListDocId, updatedList);
  }

  saveListName(i): void {
    this.creatingNewList = false;
    const updatedList = { ...this.userTodoLists[i], listName: this.newTodoListNameForm.value.newListName, editingName: false };
    this.firestoreService.updateTodoList(this.userDetails.userDocId, this.userTodoLists[i].todoListDocId, updatedList);
  }

  cancelEditList(i): void {
    this.creatingNewList = false;
    this.firestoreService.deleteTodoList(this.userDetails.userDocId, this.userTodoLists[i].todoListDocId);
  }
}
