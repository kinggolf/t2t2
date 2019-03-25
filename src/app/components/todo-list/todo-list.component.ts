import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel, TodoModel } from '../../models';
import { SubscriptionLike, Observable } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import {  AppHealthService } from '../../services/app-health.service';
import { LoadTodoListsAction, OpenCloseTodoListAction, EditTodoListNameAction, DeleteTodoListAction,
         CreateNewTodoListAction, CreateNewTodoAction, LoadActiveTodoListAction } from '../../actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todoListDetailsFromServerSub: SubscriptionLike;
  todoLists: TodoListModel[];
  todoListsSub: SubscriptionLike;
  todoListDetailsLoading$: Observable<boolean>;
  currentOpenListIndex: number;
  newTodoListName: FormGroup;
  isOnline$: Observable<boolean>;
  isOnlineSub: SubscriptionLike;
  isOnline: boolean;
  showTodosLoadingSpinner: boolean;
  prevListName: string;
  @Input() prevTodoLists: TodoListModel[];
  prevTodoListItems: TodoModel[];

  constructor(private todosService: TodosService, private store: Store<APPStore>,
              private appHealthService: AppHealthService, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.showTodosLoadingSpinner = false;
    this.todoListsSub = this.store.select('todoLists').subscribe(todoList => {
      if (todoList) {
        this.todoLists = todoList;
        console.log('TodoListComponent: this.todoLists = ', this.todoLists);
      }
    });
    this.newTodoListName = this.fb.group({
      newListName: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    this.currentOpenListIndex = -1;
    this.todoListDetailsLoading$ = this.store.select('listDetailsLoading');
    this.isOnline$ = this.appHealthService.monitorOnline();
    this.isOnline = true;
    let onlineChangeCount = 0;
    this.isOnlineSub = this.isOnline$.subscribe(online => {
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
    if (this.todoListsSub) {
      this.todoListsSub.unsubscribe();
    }
    if (this.todoListDetailsFromServerSub) {
      this.todoListDetailsFromServerSub.unsubscribe();
    }
    if (this.isOnlineSub) {
      this.isOnlineSub.unsubscribe();
    }
  }

  showListDetails(i): void {
    if ((this.todoLists[i].itemsPending + this.todoLists[i].itemsCompleted) > 0) {
      if (this.todoLists[i].showListDetails) {
        // User is closing an open list
        this.store.dispatch(new OpenCloseTodoListAction({listIndex: i, listDetails: null}));
      } else {
        // User is opening a closed list
        this.callServerForTodos(i, false);
      }
    }
  }

  editListName(i): void {
    this.prevListName = this.todoLists[i].name;
    this.store.dispatch(new EditTodoListNameAction({listIndex: i, listName: null, mode: 'edit'}));
    this.newTodoListName = this.fb.group({
      newListName: [this.todoLists[i].name, Validators.compose([Validators.required, Validators.minLength(1)])]
    });
  }

  saveListName(i): void {
    this.store.dispatch(
      new EditTodoListNameAction({listIndex: i, listName: this.newTodoListName.value.newListName, mode: 'save'})
    );
    if (this.todoLists[i].creatingNewList) {
      this.todosService.createNewList(this.newTodoListName.value.newListName).subscribe(resp => {
        console.log('In saveListName for a new list, resp = ', resp);
      });
    } else {
      this.todosService.updateList({...this.todoLists[i], name: this.newTodoListName.value.newListName}, 'name')
        .subscribe(resp => {
          console.log('In saveListName, resp = ', resp);
        });
    }
  }

  cancelEditList(i): void {
    if (this.todoLists[i].creatingNewList) {
      this.store.dispatch(new LoadTodoListsAction(this.prevTodoLists));
    } else {
      this.store.dispatch(new EditTodoListNameAction({listIndex: i, listName: this.prevListName, mode: 'cancel'}));
    }
  }

  createNewTodo(i): void {
    if (!this.todoLists[i].addingTodo) {
      if (!this.todoLists[i].items && (this.todoLists[i].itemsPending + this.todoLists[i].itemsCompleted) > 0) {
        // This list has items that have not been downloaded yet
        this.callServerForTodos(i, true);
      } else {
        this.prevTodoListItems = this.todoLists[i].items.slice(0);
        this.store.dispatch(new CreateNewTodoAction(i));
      }
    }
  }

  confirmDeleteList(i): void {
    const confirmDelete = window.confirm('Confirm Delete ' + this.todoLists[i].name);
    if (confirmDelete) {
      this.todosService.deleteTodoList(this.todoLists[i].id).subscribe(resp => {
        if (!resp) {
          // Remove this list from store
          this.store.dispatch(new DeleteTodoListAction(i));
        } else {
          console.log('deleteTodoList response = ', resp);
        }
      });
    }
  }

  callServerForTodos(i: number, callFromAddTodo: boolean): void {
    this.showTodosLoadingSpinner = true;
    this.todoListDetailsFromServerSub = this.todosService.getTodoListDetails(this.todoLists[i].id).subscribe(listDetails => {
      let offLineLoadTodosTimer;
      if (!this.isOnline) {
        offLineLoadTodosTimer = setTimeout(() => {
          this.snackBar.open('Offline & list details have not previously been downloaded.', 'OK', {
            duration: 5000,
          });
        }, 5000);
      }
      if (listDetails) {
        console.log('In callServerForTodos, listDetails = ', listDetails);
        clearTimeout(offLineLoadTodosTimer);
        this.showTodosLoadingSpinner = false;
        this.store.dispatch(new OpenCloseTodoListAction({listIndex: i, listDetails}));
        this.store.dispatch(new LoadActiveTodoListAction(listDetails));
        this.prevTodoListItems = this.todoLists[i].items.slice(0);
        if (callFromAddTodo) {
          // this.prevTodoListItems = this.todoLists[i].items.slice(0);
          this.store.dispatch(new CreateNewTodoAction(i));
        }
      }
    });
  }
}
