import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel, TodoModel } from '../../models';
import { SubscriptionLike, Observable } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { LoadTodoListsAction, OpenCloseTodoListAction, EditTodoListNameAction, DeleteTodoListAction,
         AddTodoToListAction, PrevTodoListsAction, UpdateListDetailsLoadingAction,
         LoadTodosAction} from '../../actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todosHttpSub: SubscriptionLike;
  todoLists$: Observable<TodoListModel[]>;
  todoLists: TodoListModel[];
  todoListsSub: SubscriptionLike;
  creatingNewListSub: SubscriptionLike;
  todoListDetails: TodoListModel;
  todoListDetailsSub: SubscriptionLike;
  todoListDetailsLoading$: Observable<boolean>;
  currentOpenListIndex: number;
  newTodoListName: FormGroup;
  creatingNewList: boolean;
  isOnline$: Observable<boolean>;
  isOnlineSub: SubscriptionLike;
  isOnline: boolean;
  showTodosLoadingSpinner: boolean;

  constructor(private todosService: TodosService, private store: Store<APPStore>,
              private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.showTodosLoadingSpinner = false;
    this.todoLists$ = this.store.select('todoLists');
    this.todoListsSub = this.todoLists$.subscribe(todoList => {
      if (todoList) {
        this.todoLists = todoList;
        console.log('TodoListComponent: this.todoLists = ', this.todoLists);
      }
    });
    this.creatingNewListSub = this.store.select('creatingNewList').subscribe(creatingNewList => {
      this.creatingNewList = creatingNewList;
      if (creatingNewList) {
        this.newTodoListName = this.fb.group({
          newListName: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
        });
      }
    });
    // Use addingTodo to prevent multiple create todos from being open at the same time
    this.currentOpenListIndex = -1;
    this.todoListDetailsLoading$ = this.store.select('listDetailsLoading');
    // Monitor online/offline
    this.isOnline$ = this.todosService.monitorOnline();
    this.isOnline = true;
    let onlineChangeCount = 0;
    this.isOnlineSub = this.isOnline$.subscribe(online => {
      console.log('Online = ', online);
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
    if (this.todosHttpSub) {
      this.todosHttpSub.unsubscribe();
    }
    if (this.todoListDetailsSub) {
      this.todoListDetailsSub.unsubscribe();
    }
    if (this.creatingNewListSub) {
      this.creatingNewListSub.unsubscribe();
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
        this.showTodosLoadingSpinner = true;
        this.todosHttpSub = this.todosService.getTodoListDetails(this.todoLists[i].id).subscribe(listDetails => {
          let offLineLoadTodosTimer;
          if (!this.isOnline) {
            offLineLoadTodosTimer = setTimeout(() => {
              this.snackBar.open('Offline & list details have not previously been downloaded.', 'OK', {
                duration: 5000,
              });
            }, 5000);
          }
          if (listDetails) {
            console.log('In showListDetails, listDetails = ', listDetails);
            clearTimeout(offLineLoadTodosTimer);
            this.showTodosLoadingSpinner = false;
            // this.store.dispatch((new LoadTodosAction(listDetails)));
            this.store.dispatch(new OpenCloseTodoListAction({listIndex: i, listDetails}));
          }
        });
      }
    }
  }

  editListName(i): void {
    this.store.dispatch(new EditTodoListNameAction(i));
    let prevTodoLists: TodoListModel[];
    // Use prevTodoLists to store current lists & revert back to this if user cancels editing a list name
    this.store.select('todoLists').subscribe(todoLists => {
      prevTodoLists = todoLists.slice(0);
      this.store.dispatch(new PrevTodoListsAction(prevTodoLists));
    }).unsubscribe();
    this.todoLists[i].editingName = true;
    this.newTodoListName = this.fb.group({
      newListName: [this.todoLists[i].name, Validators.compose([Validators.required, Validators.minLength(1)])]
    });
  }

  saveEditName(i): void {
    this.todoLists[i].editingName = false;
    this.store.select('prevTodoLists').subscribe(prevTodoLists => {
      this.store.dispatch((new LoadTodoListsAction(prevTodoLists)));
    }).unsubscribe();
    if (this.creatingNewList) {
      this.todosService.createNewList(this.newTodoListName.value.newListName).subscribe(newTodoListObj => {
        this.store.dispatch((new LoadTodoListsAction([
          ...[newTodoListObj],
          ...this.todoLists.slice(0)
        ])));
      });
    } else {
      // Updating name of an existing list
      const updatedList = Object.assign({
        ...this.todoLists[i],
        name: this.newTodoListName.value.newListName
      });
      this.store.dispatch((new LoadTodoListsAction([
        ...this.todoLists.slice(0, i),
        ...[updatedList],
        ...this.todoLists.slice(i + 1)
      ])));
      this.todosService.updateList(updatedList, 'name').subscribe(resp => {
        console.log('In saveEditName, resp = ', resp);
      });
    }
    this.todoLists[i].editingName = false;
    // this.store.dispatch(new CreatingNewListAction(false));
  }

  createNewTodo(i): void {
    console.log('In createNewTodo, this.todoLists[i] = ', this.todoLists[i] +
      ' & this.currentOpenListIndex  = ' + this.currentOpenListIndex );
    if (!this.todoLists[i].addingTodo) {
      const newTodo: TodoModel[] = [ { id: '', label: '', completed: false, editingTask: true } ];
      let newTodoListItems: TodoModel[];
      if (this.currentOpenListIndex === i) {
        // adding item to already open list details, so add blank item with open form, index 0
        newTodoListItems = [...newTodo, ...this.todoLists[i].items];
        const newTodoList = this.todosService.createNewTodoListObject(this.todoLists[i], [{items: newTodoListItems}]);
        this.store.dispatch(new LoadTodoListsAction(this.todosService.createNewTodoListArray(this.todoLists, newTodoList, i)));
      } else {
        if (this.currentOpenListIndex > -1) {
          // Another list is open, so must close 1st
          this.todoLists[this.currentOpenListIndex].showListDetails = false;
        }
        if ((this.todoLists[i].itemsPending + this.todoLists[i].itemsCompleted) > 0) {
          // Fetch list details
          this.todosHttpSub = this.todosService.getTodoListDetails(this.todoLists[i].id).subscribe(listDetails => {
            const newListDetails = this.todosService.createNewTodoListObject(listDetails, [
              {showListDetails: true}, {itemsCompleted: this.todoLists[i].itemsCompleted}, {itemsPending: this.todoLists[i].itemsPending}
            ]);
            this.store.dispatch(new LoadTodoListsAction(this.todosService.createNewTodoListArray(this.todoLists, newListDetails, i)));
            this.currentOpenListIndex = i;
          });
        } else {
          // This list has no todos
          this.todoLists[i].showListDetails = true;
        }
      }
    }
  }

  cancelEditListName(i): void {
    this.todoLists[i].editingName = false;
    this.store.select('prevTodoLists').subscribe(prevTodoLists => {
      this.store.dispatch((new LoadTodoListsAction(prevTodoLists)));
    }).unsubscribe();
    // this.store.dispatch(new CreatingNewListAction(false));
  }


  confirmDeleteList(i): void {
    const confirmDelete = window.confirm('Confirm Delete ' + this.todoLists[i].name);
    if (confirmDelete) {
      this.todosService.deleteTodoList(this.todoLists[i].id).subscribe(resp => {
        if (!resp) {
          // Remove this list from store
          this.store.dispatch(new LoadTodoListsAction([
            ...this.todoLists.slice(0, i),
            ...this.todoLists.slice(i + 1)
          ]));
        } else {
          console.log('deleteTodoList response = ', resp);
        }
      });
    }
  }

}
