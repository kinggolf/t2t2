import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { Observable, SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {
  todoListDetails$: Observable<TodoListModel>;
  todoListDetails: TodoListModel;
  todoListDetailsSub: SubscriptionLike;

  constructor(private todosService: TodosService, private store: Store<APPStore>) { }

  ngOnInit() {
    this.todoListDetails$ = this.store.select('todoListDetails');
    this.todoListDetailsSub = this.todoListDetails$.subscribe(listDetails => {
      this.todoListDetails = listDetails;
    });
  }

  ngOnDestroy(): void {
    this.todoListDetailsSub.unsubscribe();
  }

  toggleTodoComplete(i) {
    console.log('Toggle todo complete, i = ' + i);
  }

  editTodoInfo(i) {
    console.log('Edit todo info, i = ' + i);
  }

  deleteTodo(i) {
    console.log('Delete this todo, i = ' + i);
  }
}
