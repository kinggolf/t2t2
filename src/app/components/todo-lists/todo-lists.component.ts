import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { AppHealthService } from '../../services/app-health.service';
import { LoadTodoListsAction, OpenCloseOrUpdateTodoListAction, EditTodoListNameAction, DeleteTodoListAction,
         CreateNewTodoAction, LoadActiveTodoListAction } from '../../actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-todo-lists',
  templateUrl: './todo-lists.component.html',
  styleUrls: ['./todo-lists.component.css']
})
export class TodoListsComponent implements OnInit, OnDestroy {
  todoLists: TodoListModel[];
  todoListsServerSub2: SubscriptionLike;
  todoListsServerSub3: SubscriptionLike;
  todoListsServerSub4: SubscriptionLike;
  todoListsSub: SubscriptionLike;
  isOnlineSub: SubscriptionLike;
  newTodoListNameForm: FormGroup;
  isOnline: boolean;
  prevTodoList: TodoListModel;
  @Input() prevTodoLists: TodoListModel[];
  @Output() endCreatingNewList = new EventEmitter();

  constructor(private todosService: TodosService, private store: Store<APPStore>,
              private appHealthService: AppHealthService, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.todoListsSub = this.store.select('todoLists').subscribe(todoList => {
      if (todoList) {
        this.todoLists = todoList;
      }
    });
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
    if (this.todoListsSub) {
      this.todoListsSub.unsubscribe();
    }
    if (this.todoListsServerSub2) {
      this.todoListsServerSub2.unsubscribe();
    }
    if (this.todoListsServerSub3) {
      this.todoListsServerSub3.unsubscribe();
    }
    if (this.todoListsServerSub4) {
      this.todoListsServerSub4.unsubscribe();
    }
    if (this.isOnlineSub) {
      this.isOnlineSub.unsubscribe();
    }
  }

  showListDetails(i): void {
    if ((this.todoLists[i].itemsPending + this.todoLists[i].itemsCompleted) > 0) {
      if (this.todoLists[i].showListDetails) {
        // User is closing an open list
        this.store.dispatch(new OpenCloseOrUpdateTodoListAction({listIndex: i, openOrClose: true, listDetails: null}));
      } else {
        // User is opening a closed list
        this.callServerForTodos(i, false);
      }
    }
  }

  editListName(i): void {
    this.store.dispatch(new EditTodoListNameAction({listIndex: i, listName: null, mode: 'edit'}));
    this.newTodoListNameForm.setValue({ newListName: this.todoLists[i].name });
  }

  saveListName(i): void {
    if (this.todoLists[i].creatingNewList) {
      this.todoListsServerSub2 = this.todosService.createNewList(this.newTodoListNameForm.value.newListName).subscribe(newList => {
        this.store.dispatch(new OpenCloseOrUpdateTodoListAction({listIndex: i, openOrClose: false, listDetails: newList}));
      });
      this.store.dispatch(
        new EditTodoListNameAction({listIndex: i, listName: this.newTodoListNameForm.value.newListName, mode: 'save'})
      );
    } else {
      this.store.dispatch(
        new EditTodoListNameAction({listIndex: i, listName: this.newTodoListNameForm.value.newListName, mode: 'save'})
      );
      this.todosService.updateList({ ...this.todoLists[i], name: this.newTodoListNameForm.value.newListName}, 'name' );
    }
    this.newTodoListNameForm.setValue({ newListName: '' });
    this.endCreatingNewList.emit();
  }

  cancelEditList(i): void {
    if (this.todoLists[i].creatingNewList) {
      this.store.dispatch(new LoadTodoListsAction(this.prevTodoLists));
    } else {
      this.store.dispatch(new EditTodoListNameAction({listIndex: i, listName: null, mode: 'cancel'}));
    }
    this.newTodoListNameForm.setValue({ newListName: '' });
    this.endCreatingNewList.emit();
  }

  createNewTodo(i): void {
    if (!this.todoLists[i].addingTodo) {
      if (!this.todoLists[i].showListDetails) {
        // This list has items that have not been downloaded yet
        this.callServerForTodos(i, true);
      } else {
        this.prevTodoList = { ...this.todoLists[i] };
        this.store.dispatch(new CreateNewTodoAction(i));
        this.store.dispatch(new LoadActiveTodoListAction(this.todoLists[i]));
      }
    }
  }

  confirmDeleteList(i): void {
    const confirmDelete = window.confirm('Confirm Delete ' + this.todoLists[i].name);
    if (confirmDelete) {
      this.todoListsServerSub3 = this.todosService.deleteTodoList(this.todoLists[i].id).subscribe(resp => {
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
    if (this.isOnline || (!this.isOnline && this.todoLists[i].items)) {
      if (this.todoListsServerSub4) {
        this.todoListsServerSub4.unsubscribe();
      }
      this.todoListsServerSub4 = this.todosService.getTodoListDetails(this.todoLists[i].id).subscribe(listDetails => {
        if (listDetails) {
          this.store.dispatch(new OpenCloseOrUpdateTodoListAction({ listIndex: i, openOrClose: true, listDetails }));
          this.prevTodoList = { ...this.todoLists[i] };
          if (callFromAddTodo) {
            this.store.dispatch(new CreateNewTodoAction(i));
          }
          this.store.dispatch(new LoadActiveTodoListAction(this.todoLists[i]));
        }
      });
    } else {
      this.snackBar.open('Offline & list details have not previously been downloaded.', 'OK', {
        duration: 5000,
      });
    }
  }
}
