import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { Observable, SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { AppHealthService } from '../../services/app-health.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditTodoLabelAction, UpdateTodoListsWithUpdatedListItemsAction, DeleteTodoAction,
         LoadActiveTodoListAction, ToggleTodoAction } from '../../actions';

@Component({
  selector: 'app-todos',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  activeList: TodoListModel;
  todoLists: TodoListModel[];
  newTodoLabel: FormGroup;
  prevTodoLabel: string;
  activeListSub: SubscriptionLike;
  todoListsSub: SubscriptionLike;
  todoListsServerSub1: SubscriptionLike;
  todoListsServerSub2: SubscriptionLike;
  todoListsServerSub3: SubscriptionLike;
  todoListsServerSub4: SubscriptionLike;
  activeList$: Observable<TodoListModel>;
  isOnline$: Observable<boolean>;
  @Input() prevTodoList: TodoListModel;
  @Input() listIndex: number;
  @Input() listId: string;

  constructor(private todosService: TodosService, private store: Store<APPStore>,
              private fb: FormBuilder, private appHealthService: AppHealthService) { }

  ngOnInit() {
    /*
  }
    this.todoListsSub = this.store.select('todoLists').subscribe(todoList => {
      if (todoList) {
        this.todoLists = todoList;
        console.log('TodoComponent: this.todoLists = ', this.todoLists);
        this.activeList = todoList[this.listIndex];
        console.log('In TodoComponent, this.activeList = ', this.activeList);
      }
    }); */
    this.activeList$ = this.store.select('activeTodoList');
    this.activeListSub = this.activeList$.subscribe(activeList => {
      console.log('In TodoComponent, activeList = ', activeList);
      this.activeList = activeList;
    });
    this.newTodoLabel = this.fb.group({
      newItemLabel: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    this.isOnline$ = this.appHealthService.monitorOnline();
  }

  ngOnDestroy(): void {
    if (this.activeListSub) {
      this.activeListSub.unsubscribe();
    }
  }

  toggleTodoComplete(i) {
    if (this.todoListsServerSub1) {
      this.todoListsServerSub1.unsubscribe();
    }
    this.todoListsServerSub1 = this.todosService.updateTodo(this.activeList.items[i].id, '',
      !this.activeList.items[i].completed)
      .subscribe(updatedTodoItem => {});
    this.store.dispatch(new ToggleTodoAction(i));
    this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
      listIndex: this.listIndex, itemIndex: i, label: null, mode: 'toggleComplete'
    }));
  }

  editTodoLabel(i) {
    this.newTodoLabel = this.fb.group({
      newItemLabel: [this.activeList.items[i].label, Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    this.prevTodoLabel = this.activeList.items[i].label.slice(0);
    /*
    this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
      listIndex: this.listIndex, itemIndex: i, label: this.activeList.items[i].label, mode: 'enableEditLabel'
    }));
    this.newTodoLabel.setValue({ newItemLabel: this.activeList.items[i].label }); */
    this.store.dispatch(new EditTodoLabelAction({ itemIndex: i, itemLabel: this.newTodoLabel.value.newItemLabel, mode: 'edit' }));
  }

  cancelEditDetails(i) {
    if (this.activeList.items[i].label !== '') {
      this.store.dispatch(new EditTodoLabelAction({ itemIndex: i, itemLabel: this.prevTodoLabel, mode: 'cancel' }));
      // this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
      //   listIndex: this.listIndex, itemIndex: i, label: this.prevTodoLabel, mode: 'cancelEditLabel'
      // }));
    } else {
      // Cancel from adding a todoItem
      this.store.dispatch(new LoadActiveTodoListAction(this.prevTodoList));
    }
  }

  saveEditLabel(i) {
    if (this.activeList.items[i].label !== '') {
      // From editing an existing item
      if (this.todoListsServerSub2) {
        this.todoListsServerSub2.unsubscribe();
      }
      this.todoListsServerSub2 = this.todosService.updateTodo(
        this.activeList.items[i].id, this.newTodoLabel.value.newItemLabel, this.activeList.items[i].completed)
        .subscribe(updatedTodoItem => {});
      this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
        listIndex: this.listIndex, itemIndex: i, label: this.newTodoLabel.value.newItemLabel, mode: 'editLabel'
      }));
      this.store.dispatch(new EditTodoLabelAction({ itemIndex: i, itemLabel: this.newTodoLabel.value.newItemLabel, mode: 'save'}));
    } else {
      // From creating a new item
      if (this.todoListsServerSub3) {
        this.todoListsServerSub3.unsubscribe();
      }
      this.todoListsServerSub3 = this.todosService.createNewTodo(this.activeList.id, this.newTodoLabel.value.newItemLabel)
        .subscribe(updatedTodoDetails => {});
      this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
        listIndex: this.listIndex, itemIndex: i, label: this.newTodoLabel.value.newItemLabel, mode: 'creatingItem'
      }));
      this.store.dispatch(new EditTodoLabelAction({ itemIndex: i, itemLabel: this.newTodoLabel.value.newItemLabel, mode: 'save'}));
    }
  }

  deleteTodo(i) {
    const confirmDelete = window.confirm('Confirm Delete ' + this.activeList.items[i].label);
    if (confirmDelete) {
      if (this.todoListsServerSub4) {
        this.todoListsServerSub4.unsubscribe();
      }
      this.todoListsServerSub4 = this.todosService.deleteTodo(this.activeList.items[i].id).subscribe(resp => {
        if (!resp) {
          // Remove this item from store & update lists
          this.store.dispatch(new DeleteTodoAction(i));
          this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
            listIndex: this.listIndex, itemIndex: i, label: null, mode: 'deleteItem'
          }));
        } else {
          console.log('deleteTodoList response = ', resp);
        }
      });
    }
  }

}
