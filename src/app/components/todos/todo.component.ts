import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  todoListDetails: TodoListModel;
  todoListDetailsSub: SubscriptionLike;

  constructor(private todosService: TodosService, private store: Store<APPStore>) { }

  ngOnInit() {
    this.todoListDetailsSub = this.store.select('todoListDetails').subscribe(listDetails => {
      this.todoListDetails = listDetails;
      let i = 0;
      this.todoListDetails.items.map(item => {
        this.todoListDetails.items[i].editingTask = false;
        i++;
      });
    });
  }

  ngOnDestroy(): void {
    this.todoListDetailsSub.unsubscribe();
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
