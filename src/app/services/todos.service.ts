import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel, TodoModel } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoListAction } from '../actions';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private http: HttpClient, private store: Store<APPStore>) {}

  getTodoLists(): Observable<TodoListModel[]> {
    return this.http.get<TodoListModel[]>('http://localhost:4200/assets/mock-data/todo-lists.json');
    /*
    this.http.get<TodoListModel[]>('http://localhost:4200/assets/mock-data/todo-lists.json').subscribe(
      resp => {
        console.log(resp);
        this.store.dispatch(new TodoListAction(resp));
      }
    ); */
  }
  /*
  getTodoLists(): void {
    console.log('In getTodoLists');
    this.http.get<TodoListModel[]>('http://localhost:4200/assets/mock-data/todo-lists.json').pipe(
      map((resp: TodoListModel[]) => {
        // return resp; Observable<TodoListModel[]> return
        console.log(resp);
        this.store.dispatch(new TodoListAction(resp));
      })
    );
  } */

  getTodos(todoListId): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>('http://localhost:4200/assets/mock-data/todo-' + todoListId + '.json');
    /*
    return this.http.get<TodoModel[]>('http://localhost:4200/assets/mock-data/todo-' + todoListId + '.json').pipe(
      map((resp: TodoModel[]) => {
        return resp;
      })
    ); */
  }

}
