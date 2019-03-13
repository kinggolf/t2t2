import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TodoListDetailsAction} from '../../actions';

@Component({
  selector: 'app-todos',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  todoListDetails: TodoListModel;
  todoListDetailsSub: SubscriptionLike;
  creatingNewTodoSub: SubscriptionLike;
  newTodoListLabel: FormGroup;
  creatingNewTodo: boolean;

  constructor(private todosService: TodosService, private store: Store<APPStore>, private fb: FormBuilder) { }

  ngOnInit() {
    this.todoListDetailsSub = this.store.select('todoListDetails').subscribe(listDetails => {
      console.log('In TodoComponent, listDetails = ', listDetails);
      this.todoListDetails = listDetails;
      if (this.todoListDetails.items[0].editingTask) {
        // Adding a new todo to this list
      }
      /*
      let i = 0;
      this.todoListDetails.items.map(item => {
        this.todoListDetails.items[i].editingTask = false;
        i++;
      }); */
    });
    this.creatingNewTodoSub = this.store.select('creatingNewTodo').subscribe(creatingNewTodo => {
      this.creatingNewTodo = creatingNewTodo;
      if (creatingNewTodo) {
        this.newTodoListLabel = this.fb.group({
          newListName: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
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
    console.log('Toggle todo complete, i = ' + i);
  }

  editTodoInfo(i) {
    this.todoListDetails.items[i].editingTask = true;
  }

  cancelEditTask(i) {
    this.todoListDetails.items[i].editingTask = false;
  }

  saveEditTask(i) {
    this.todoListDetails.items[i].editingTask = false;
    // Save this new name
  }

  deleteTodo(i) {
    console.log('Delete this todo, i = ' + i);
  }
}
