import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel, TodoModel } from '../../models';
import { Observable, SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {EditTodoLabelAction, UpdateTodoListsWithUpdatedListItemsAction, DeleteTodoAction, LoadActiveTodoListAction} from '../../actions';

@Component({
  selector: 'app-todos',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  activeList: TodoListModel;
  @Input() prevTodoList: TodoListModel;
  @Input() listIndex: number;
  @Input() listId: string;
  newTodoLabel: FormGroup;
  // editingExistingTodoLabel: boolean;
  prevTodoLabel: string;
  activeListSub: SubscriptionLike;
  activeList$: Observable<TodoListModel>;

  constructor(private todosService: TodosService, private store: Store<APPStore>, private fb: FormBuilder) { }

  ngOnInit() {
    // this.editingExistingTodoLabel = false;
    console.log('In TodoComponent ngOnInit, this.prevTodoList = ', this.prevTodoList);
    this.activeList$ = this.store.select('activeTodoList');
    this.activeListSub = this.activeList$.subscribe(activeList => {
      console.log('In TodoComponent, activeList = ', activeList);
      this.activeList = activeList;
    });
    this.newTodoLabel = this.fb.group({
      newItemLabel: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
  }

  ngOnDestroy(): void {
    if (this.activeListSub) {
      this.activeListSub.unsubscribe();
    }
  }

  toggleTodoComplete(i) {
    // this.activeList.items[i].completed = !this.activeList.items[i].completed;
    const updatedTodo = { ...this.activeList.items[i], completed: !this.activeList.items[i].completed };
    this.storeUpdatedListItems(i, updatedTodo, 'toggleComplete');
    this.todosService.updateTodo(this.activeList.items[i].id, '', this.activeList.items[i].completed)
      .subscribe(updatedTodoItem => {});
  }

  editTodoLabel(i) {
    // this.editingExistingTodoLabel = true;
    this.newTodoLabel = this.fb.group({
      newItemLabel: [this.activeList.items[i].label, Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    this.prevTodoLabel = this.activeList.items[i].label.slice(0);
    this.store.dispatch(new EditTodoLabelAction(
      { listIndex: this.listIndex, itemIndex: i, itemLabel: this.newTodoLabel.value.newItemLabel, mode: 'edit' }
    ));
  }

  cancelEditDetails(i) {
    // if (this.activeList.items[i].editingLabel) {
    if (this.activeList.items[i].label !== '') {
      this.store.dispatch(new EditTodoLabelAction(
        { listIndex: this.listIndex, itemIndex: i, itemLabel: this.prevTodoLabel, mode: 'cancel' }
      ));
    } else {
      // Cancel from adding a todoItem
      this.store.dispatch(new LoadActiveTodoListAction(this.prevTodoList));
    }
  }

  saveEditLabel(i) {
    // Anytime the activeList is updated, then incorporate this into todoLists
    const updatedTodo = { ...this.activeList.items[i], editingLabel: false, label: this.newTodoLabel.value.newItemLabel};
    this.storeUpdatedListItems(i, updatedTodo, 'editLabel');
    // if (this.activeList.items[i].editingLabel) {
    if (this.activeList.items[i].label !== '') {
      // From editing an existing item
      this.todosService.updateTodo(this.activeList.items[i].id, this.newTodoLabel.value.newItemLabel, this.activeList.items[i].completed)
        .subscribe(updatedTodoItem => {});
    } else {
      // From creating a new item
      this.todosService.createNewTodo(this.activeList.id, this.newTodoLabel.value.newItemLabel)
        .subscribe(updatedTodoDetails => {});
    }
    this.store.dispatch(
      new EditTodoLabelAction({
        listIndex: this.listIndex, itemIndex: i, itemLabel: this.newTodoLabel.value.newItemLabel, mode: 'save'
      })
    );
  }

  deleteTodo(i) {
    const confirmDelete = window.confirm('Confirm Delete ' + this.activeList.items[i].label);
    if (confirmDelete) {
      this.todosService.deleteTodo(this.activeList.items[i].id).subscribe(resp => {
        if (!resp) {
          // Remove this list from store
          this.store.dispatch(new DeleteTodoAction(i));
          this.storeUpdatedListItems(i, null, 'deleteItem');
        } else {
          console.log('deleteTodoList response = ', resp);
        }
      });
    }
  }

  storeUpdatedListItems(i, updatedTodo, mode) {
    const updatedActiveListItems = [ ...this.activeList.items.slice(0, i), updatedTodo, ...this.activeList.items.slice(i + 1) ];
    this.store.dispatch(new UpdateTodoListsWithUpdatedListItemsAction({
      listIndex: this.listIndex,
      updatedListItems: updatedActiveListItems,
      mode
    }));
  }

}
