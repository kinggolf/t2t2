import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { trigger, animate, style, transition, state } from '@angular/animations';
import { SubscriptionLike } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { AppHealthService } from '../../services/app-health.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Platform } from '@angular/cdk/platform';
import { TodosComponent } from '../todos/todos.component';
import { TodoListModel, UserModel } from '../../models';

@Component({
  selector: 'app-todo-lists',
  templateUrl: './todo-lists.component.html',
  animations: [
    trigger('showTodos', [
      state('show', style({height: '*', })),
      state('hide', style({height: '0px'})),
      transition('hide <=> show', [
        animate('250ms ease-out')
      ])
    ]),
  ]
})
export class TodoListsComponent implements OnInit, OnDestroy {
  userDetails: UserModel;
  userDetailsSub: SubscriptionLike;
  userTodoLists: TodoListModel[];
  userTodoListsSub: SubscriptionLike;
  isOnlineSub: SubscriptionLike;
  newTodoListNameForm: FormGroup;
  showLoadingSpinner: boolean;
  isOnline: boolean;
  @Input() userUID: string;
  creatingNewList: boolean;
  editingListNameIndex: number;
  showListDetailsIndex: number;
  addingTodoListIndex: number;
  @ViewChild(TodosComponent) private todosComp: TodosComponent;

  constructor(private firestoreService: FirestoreService, private appHealthService: AppHealthService,
              private fb: FormBuilder, private snackBar: MatSnackBar, private platform: Platform) { }

  ngOnInit() {
    this.editingListNameIndex = this.showListDetailsIndex = this.addingTodoListIndex = -1;
    this.showLoadingSpinner = true;
    this.initAndSubscribeToData(false);
    this.newTodoListNameForm = this.fb.group({
      newListName: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    this.isOnline = true;
    let onlineChangeCount = 0;
    this.isOnlineSub = this.appHealthService.monitorOnline().subscribe(online => {
      this.isOnline = online;
      if (!online) {
        if (!this.userTodoLists) {
          this.showLoadingSpinner = false;
          this.snackBar.open('Offline - must be online to initially load data.', 'Got it', {
            duration: 5000,
          });
        } else {
          this.snackBar.open('Offline - updates will be sync\'d when back online.', 'Got it', {
            duration: 5000,
          });
        }
      } else if (onlineChangeCount > 0) {
        if (!this.userDetails) {
          this.showLoadingSpinner = true;
          this.initAndSubscribeToData(true);
        } else {
          this.snackBar.open('Online - full functionality.', 'OK', {
            duration: 5000,
          });
        }
      }
      onlineChangeCount++;
    });
    const isInStandaloneMode = () => ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone);
    if (this.platform.IOS && !isInStandaloneMode()) {
      this.snackBar.open('Add to Home Screen by tapping share icon below and then Add to Home Screen', 'Got it', {
        duration: 8000,
      });
    }
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

  initAndSubscribeToData(transitionToOnline: boolean): void {
    if (this.userDetailsSub) {
      this.userDetailsSub.unsubscribe();
    }
    if (this.userTodoListsSub) {
      this.userTodoListsSub.unsubscribe();
    }
    this.userDetailsSub = this.firestoreService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails[0];
      this.userTodoListsSub = this.firestoreService.getUserTodoLists().subscribe(userTodoLists => {
        if (userTodoLists) {
          console.log('In initAndSubscribeToData, userTodoLists = ', userTodoLists);
          this.showLoadingSpinner = false;
          if (transitionToOnline) {
            this.snackBar.open('Online - full functionality.', 'OK', {
              duration: 5000,
            });
            transitionToOnline = false;
          }
        }
        this.userTodoLists = userTodoLists;
      });
      if (this.userDetails) {
        this.firestoreService.initUserTodoLists(this.userDetails.userDocId);
      }
    });
    this.firestoreService.initUserDetails(this.userUID);
  }

  drop(event: CdkDragDrop<TodoListModel[]>) {
    console.log('In drop, this.userTodoLists 1 = ', this.userTodoLists);
    // moveItemInArray(this.userTodoLists, event.previousIndex, event.currentIndex);
    console.log('In drop, event.previousIndex = ', event.previousIndex + ' & event.currentIndex = ', event.currentIndex);
    console.log('In drop, this.userTodoLists 2 = ', this.userTodoLists);
    this.moveList(event.previousIndex, event.currentIndex);
  }

  moveList(prevIndex, curIndex) {
    if (prevIndex > curIndex) {
      // Then moving a list up
      const copyOfTodoList = { ...this.userTodoLists };
      const movedTodoList = { ...copyOfTodoList[prevIndex], orderIndex: curIndex };
      const movedTodoListDocId = movedTodoList.todoListDocId;
      delete movedTodoList.todoListDocId;
      let tempTodoList: TodoListModel;
      let tempTodoListDocId: string;
      for (let i = prevIndex - 1; i > curIndex - 1; i--) {
        tempTodoList = { ...copyOfTodoList[i], orderIndex: i + 1 };
        tempTodoListDocId = copyOfTodoList[i].todoListDocId;
        delete tempTodoList.todoListDocId;
        console.log('In moveList, i = ', i + ' & tempTodoListDocId = ' + tempTodoListDocId + ' & tempTodoList = ', tempTodoList);
        this.firestoreService.updateTodoList(this.userDetails.userDocId, tempTodoListDocId, tempTodoList);
      }
      console.log('In moveList, movedTodoListDocId = ', movedTodoListDocId + ' & movedTodoList = ', movedTodoList);
      this.firestoreService.updateTodoList(this.userDetails.userDocId, movedTodoListDocId, movedTodoList);
    }
  }

  showListDetails(i): void {
    if ((this.userTodoLists[i].itemsPending + this.userTodoLists[i].itemsCompleted) > 0) {
      this.showListDetailsIndex === -1 ? this.showListDetailsIndex = i : this.showListDetailsIndex = -1;
    }
    this.addingTodoListIndex = -1;
  }

  createNewList(): void {
    this.creatingNewList = true;
    this.firestoreService.createNewTodoList(this.userDetails.userDocId, '').then(newListDocId => {
      let i = 0;
      this.userTodoLists.forEach(todoList => {
        if (todoList.todoListDocId === newListDocId) {
          this.editingListNameIndex = i;
        }
        i++;
      });
      this.newTodoListNameForm.setValue({ newListName: '' });
    });
  }

  logout(): void {
    const confirmLogout = window.confirm('Confirm Logout');
    if (confirmLogout) {
      this.firestoreService.authLogout();
    }
  }

  editListName(i): void {
    this.newTodoListNameForm.setValue({ newListName: this.userTodoLists[i].listName });
    this.editingListNameIndex = i;
  }

  saveListName(i): void {
    this.creatingNewList = false;
    this.editingListNameIndex = -1;
    const updatedList = { ...this.userTodoLists[i], listName: this.newTodoListNameForm.value.newListName };
    this.firestoreService.updateTodoList(this.userDetails.userDocId, this.userTodoLists[i].todoListDocId, updatedList);
    this.newTodoListNameForm.setValue({ newListName: '' });
  }

  cancelEditListName(i): void {
    this.creatingNewList = false;
    this.editingListNameIndex = -1;
    if (this.userTodoLists[i].listName === '') {
      this.firestoreService.deleteTodoList(this.userDetails.userDocId, this.userTodoLists[i].todoListDocId);
    }
    this.newTodoListNameForm.setValue({ newListName: '' });
  }

  addNewTodo(i): void {
    if (this.addingTodoListIndex === -1) {
      this.addingTodoListIndex = i;
      let newTodosArray = [{ label: '', completed: false }];
      if (this.userTodoLists[i].todos) {
        newTodosArray = [ ...newTodosArray, ...this.userTodoLists[i].todos];
      }
      const updatedList = { ...this.userTodoLists[i], todos: newTodosArray };
      this.firestoreService.updateTodoList(this.userDetails.userDocId, this.userTodoLists[i].todoListDocId, updatedList);
      this.showListDetailsIndex = i;
      setTimeout(() => {
        this.todosComp.editTodo(0);
      }, 250);
    }
  }

  confirmDeleteList(i): void {
    const confirmDelete = window.confirm('Confirm Delete ' + this.userTodoLists[i].listName);
    if (confirmDelete) {
      this.firestoreService.deleteTodoList(this.userDetails.userDocId, this.userTodoLists[i].todoListDocId);
    }
  }

}
