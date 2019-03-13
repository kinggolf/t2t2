import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TodoListDetailsAction, CreatingNewTodoAction, TodoListsAction} from '../../actions';

@Component({
  selector: 'app-todos',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  todoListDetails: TodoListModel;
  todoListDetailsSub: SubscriptionLike;
  creatingNewTodoSub: SubscriptionLike;
  todosHttpSub: SubscriptionLike;
  newTodoListLabel: FormGroup;
  creatingNewTodo: boolean;

  constructor(private todosService: TodosService, private store: Store<APPStore>, private fb: FormBuilder) { }

  ngOnInit() {
    this.todoListDetailsSub = this.store.select('todoListDetails').subscribe(listDetails => {
      this.todoListDetails = listDetails;
      console.log('In TodoComponent, this.todoListDetails = ', this.todoListDetails);
    });
    this.creatingNewTodoSub = this.store.select('creatingNewTodo').subscribe(creatingNewTodo => {
      this.creatingNewTodo = creatingNewTodo;
      if (creatingNewTodo) {
        this.newTodoListLabel = this.fb.group({
          newTodoLabel: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.todoListDetailsSub) {
      this.todoListDetailsSub.unsubscribe();
    }
    if (this.creatingNewTodoSub) {
      this.creatingNewTodoSub.unsubscribe();
    }
  }

  toggleTodoComplete(i) {
    this.todoListDetails.items[i].completed = !this.todoListDetails.items[i].completed;
    this.todosService.updateTodo(this.todoListDetails.items[i].id, '', this.todoListDetails.items[i].completed)
      .subscribe(updatedTodoItem => {
        const updatedItems = [
          ...this.todoListDetails.items.slice(0, i),
          updatedTodoItem,
          ...this.todoListDetails.items.slice(i + 1),
        ];
        this.store.dispatch((new TodoListDetailsAction(Object.assign(
          {},
          Object.assign(this.todoListDetails, {items: updatedItems}))))
        );
      });
  }

  editTodoInfo(i) {
    this.todoListDetails.items[i].editingTask = true;
    this.newTodoListLabel = this.fb.group({
      newTodoLabel: [this.todoListDetails.items[i].label,
        Validators.compose([Validators.required, Validators.minLength(1)])]
    });
  }

  cancelEditLabel(i) {
    this.store.dispatch(new CreatingNewTodoAction(false));
    this.store.select('prevTodoListDetails').subscribe(todoListDetails => {
      if (todoListDetails) {
        this.store.dispatch(new TodoListDetailsAction(Object.assign(todoListDetails)));
      } else {
        this.store.dispatch(new TodoListDetailsAction(null));
      }
    }).unsubscribe();
    this.todoListDetails.items[i].editingTask = false;
  }

  saveEditLabel(i) {
    this.todoListDetails.items[i].editingTask = false;
    console.log('saveEditLabel, i = ' + i + ' & todoListDetails = ', this.todoListDetails);
    if (this.creatingNewTodo) {
      this.todosService.createNewTodo(this.todoListDetails.id, this.newTodoListLabel.value.newTodoLabel)
        .subscribe(updatedTodoDetails => {
          console.log('Server Create Todo Item updatedTodoDetails = ', updatedTodoDetails);
          this.store.dispatch((new TodoListDetailsAction(Object.assign({}, updatedTodoDetails))));
        });
    } else {
      // Updating label of an existing todo
      this.todosService.updateTodo(this.todoListDetails.items[i].id, this.newTodoListLabel.value.newTodoLabel, false)
        .subscribe(updatedTodoItem => {
          console.log('saveEditLabel update, updatedTodoItem = ', updatedTodoItem);
          const updatedItems = [
            ...this.todoListDetails.items.slice(0, i),
            updatedTodoItem,
            ...this.todoListDetails.items.slice(i + 1),
          ];
          this.store.dispatch((new TodoListDetailsAction(Object.assign(
            {},
            Object.assign(this.todoListDetails, {items: updatedItems}))))
          );
        });
    }
    this.store.dispatch(new CreatingNewTodoAction(false));
  }

  deleteTodo(i) {
    console.log('Delete this todo, i = ' + i);
    const confirmDelete = window.confirm('Confirm Delete ' + this.todoListDetails.items[i].label);
    if (confirmDelete) {
      this.todosService.deleteTodo(this.todoListDetails.items[i].id).subscribe(resp => {
        if (!resp) {
          // Remove this list from store
          const updatedItems = [
            ...this.todoListDetails.items.slice(0, i),
            ...this.todoListDetails.items.slice(i + 1),
          ];
          this.store.dispatch((new TodoListDetailsAction(Object.assign(
            {},
            Object.assign(this.todoListDetails, {items: updatedItems}))))
          );
        } else {
          console.log('deleteTodoList response = ', resp);
        }
      });
    }
  }
}
