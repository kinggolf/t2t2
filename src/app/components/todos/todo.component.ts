import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel, TodoModel } from '../../models';
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
  todos: TodoModel[];
  todoListDetailsSub: SubscriptionLike;

  constructor(private todosService: TodosService, private store: Store<APPStore>) { }

  ngOnInit() {
    console.log('In TodoComponent ngOnInit');
    this.todoListDetails$ = this.store.select('todoListDetails');
    this.todoListDetailsSub = this.todoListDetails$.subscribe(listDetails => {
      console.log(listDetails);
      this.todoListDetails = listDetails;
    });
    // this.todosService.getTodoLists();
    /*
    this.todosService.getTodoLists().subscribe(resp => {
      this.todoLists = resp;
    }); */
  }

  ngOnDestroy(): void {
    this.todoListDetailsSub.unsubscribe();
  }
  /*
  getTodosOfList(listId) {
    this.todosService.getTodoListDetails(listId).subscribe(resp => {
      this.todos = resp;
    });
  } */

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
