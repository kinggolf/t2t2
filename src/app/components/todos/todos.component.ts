import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TodoModel } from '../../models';
import { Observable, SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { AppHealthService } from '../../services/app-health.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit, OnDestroy {
  // activeList: TodoListModel;
  newTodoLabel: FormGroup;
  // prevTodoLabel: string;
  // activeListSub: SubscriptionLike;
  // todoListsServerSub4: SubscriptionLike;
  // todoListsServerSub3: SubscriptionLike;
  // activeList$: Observable<TodoListModel>;
  isOnline$: Observable<boolean>;
  @Input() todos: TodoModel[];
  // @Input() listIndex: number;
  // @Input() listId: string;

  constructor(private todosService: TodosService, private fb: FormBuilder, private appHealthService: AppHealthService) { }

  ngOnInit() {
    /*
    this.activeList$ = this.store.select('activeTodoList');
    this.activeListSub = this.activeList$.subscribe(activeList => {
      this.activeList = activeList;
    }); */
    this.newTodoLabel = this.fb.group({
      newItemLabel: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    this.isOnline$ = this.appHealthService.monitorOnline();
    console.log('In TodosComponent: this.todos = ', this.todos);
  }

  ngOnDestroy(): void {
    /*
    if (this.activeListSub) {
      this.activeListSub.unsubscribe();
    } */
  }
  /*
  toggleTodoComplete(i) {
    this.todosService.updateTodo(this.activeList.items[i].id, '', !this.activeList.items[i].completed);
    this.store.dispatch(new ToggleTodoCompleteAction(i));
    this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
      listIndex: this.listIndex, itemIndex: i, label: null, mode: 'toggleComplete'
    }));
  }

  editTodoLabel(i) {
    this.newTodoLabel = this.fb.group({
      newItemLabel: [this.activeList.items[i].label, Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    this.prevTodoLabel = this.activeList.items[i].label.slice(0);
    this.store.dispatch(new EditTodoLabelAction(
      { itemIndex: i, itemLabel: this.newTodoLabel.value.newItemLabel, newList: null, mode: 'edit' }));
  }

  cancelEditDetails(i) {
    if (this.activeList.items[i].label !== '') {
      this.store.dispatch(new EditTodoLabelAction({ itemIndex: i, itemLabel: this.prevTodoLabel, newList: null, mode: 'cancel' }));
    } else {
      // Cancel from adding a todoItem
      this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
        listIndex: this.listIndex, itemIndex: i, label: this.newTodoLabel.value.newItemLabel, mode: 'cancelEditLabel'
      }));
      this.store.dispatch(new LoadActiveTodoListAction(this.prevTodoList));
    }
  }

  saveEditLabel(i) {
    if (this.activeList.items[i].label !== '') {
      // From editing an existing item
      this.todosService.updateTodo(this.activeList.items[i].id, this.newTodoLabel.value.newItemLabel, this.activeList.items[i].completed);
      this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
        listIndex: this.listIndex, itemIndex: i, label: this.newTodoLabel.value.newItemLabel, mode: 'editLabel'
      }));
      this.store.dispatch(new EditTodoLabelAction(
        { itemIndex: i, itemLabel: this.newTodoLabel.value.newItemLabel, newList: null, mode: 'save'}));
    } else {
      // From creating a new item
      if (this.todoListsServerSub3) {
        this.todoListsServerSub3.unsubscribe();
      }
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
  */
}
