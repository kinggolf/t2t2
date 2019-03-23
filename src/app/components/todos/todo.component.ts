import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { Observable, SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadTodoListsAction, EditTodoLabelAction, DeleteTodoAction, ToggleTodoCompleteAction } from '../../actions';

@Component({
  selector: 'app-todos',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  @Input() todoListDetails: TodoListModel;
  newTodoListLabel: FormGroup;

  constructor(private todosService: TodosService, private store: Store<APPStore>, private fb: FormBuilder) { }

  ngOnInit() {
    console.log('TodoListComponent: this.todoListDetails = ', this.todoListDetails);
    this.newTodoListLabel = this.fb.group({
      newTodoLabel: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
  }

  ngOnDestroy(): void {

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
        this.store.dispatch(new ToggleTodoCompleteAction(i));
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
    /*
    const updatedTodo = this.todosService.createNewTodoListObject(this.todoLists[i], [{ addingTodo: false}]);
    this.store.dispatch(new LoadTodoListsAction(this.todosService.createNewTodoListArray(this.todoLists, updatedTodo, i)));
    this.store.select('prevTodoListDetails').subscribe(prevTodoListDetails => {
      if (prevTodoListDetails) {
        this.store.dispatch(new TodoListDetailsAction(Object.assign(prevTodoListDetails)));
        // this.todoListDetails.items[i].editingTask = false;
      } else {
        const todoListsNoShow = [];
        this.store.select('todoLists').subscribe(todoLists => {
          todoLists.map(list => {
            todoListsNoShow.push(Object.assign(list, {showListDetails: false}));
          });
        }).unsubscribe();
        this.store.dispatch(new LoadTodoListsAction([...todoListsNoShow.slice(0)]));
        this.store.dispatch(new TodoListDetailsAction(null));
      }
    }).unsubscribe(); */
  }

  saveEditLabel(i) {
    /*
    this.todoListDetails.items[i].editingTask = false;
    if (this.todoLists[i].addingTodo) {
      this.todosService.createNewTodo(this.todoListDetails.id, this.newTodoListLabel.value.newTodoLabel)
        .subscribe(updatedTodoDetails => {
          this.store.dispatch((new TodoListDetailsAction(Object.assign({}, updatedTodoDetails))));
        });
    } else {
      // Updating label of an existing todo
      this.todosService.updateTodo(this.todoListDetails.items[i].id, this.newTodoListLabel.value.newTodoLabel, false)
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
    const updatedTodo = this.todosService.createNewTodoListObject(this.todoLists[i], [{ addingTodo: false}]);
    this.store.dispatch(new LoadTodoListsAction(this.todosService.createNewTodoListArray(this.todoLists, updatedTodo, i))); */
  }

  deleteTodo(i) {
    const confirmDelete = window.confirm('Confirm Delete ' + this.todoListDetails.items[i].label);
    if (confirmDelete) {
      this.todosService.deleteTodo(this.todoListDetails.items[i].id).subscribe(resp => {
        if (!resp) {
          // Remove this list from store
          this.store.dispatch(new DeleteTodoAction(i));
        } else {
          console.log('deleteTodoList response = ', resp);
        }
      });
    }
  }
}
