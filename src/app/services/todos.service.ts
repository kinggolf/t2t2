import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel, TodoModel } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoListsAction } from '../actions';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private http: HttpClient, private store: Store<APPStore>) {}

  getTodoLists(): Observable<TodoListModel[]> {
    return this.http.get<TodoListModel[]>('http://localhost:4200/assets/mock-data/todo-lists.json');
  }

  getTodoListDetails(todoListId): Observable<TodoListModel> {
    return this.http.get<TodoListModel>('http://localhost:4200/assets/mock-data/todos-' + todoListId + '.json');
  }

}
