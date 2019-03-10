import { Component, OnInit } from '@angular/core';
import { TodoListModel, TodoModel } from '../../models';
import { Observable } from 'rxjs';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todoLists: TodoListModel[];
  todos: TodoModel[];

  constructor(private todosService: TodosService) { }

  ngOnInit() {
    // this.todosService.getTodoLists();
    /*
    this.todosService.getTodoLists().subscribe(resp => {
      this.todoLists = resp;
    }); */
  }

  getTodosOfList(listId) {
    this.todosService.getTodos(listId).subscribe(resp => {
      this.todos = resp;
    });
  }

}
