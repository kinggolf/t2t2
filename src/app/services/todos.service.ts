import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { APPStore, BASE_URL, TodoListModel } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private http: HttpClient, private store: Store<APPStore>) {}

  getTodoLists(): Observable<TodoListModel[]> {
    const todoListsURL = BASE_URL + '/api/docket/todo';
    return this.http.get<TodoListModel[]>(todoListsURL);
    // return this.http.get<TodoListModel[]>('http://localhost:4200/assets/mock-data/todo-lists.json');
  }

  getTodoListDetails(todoListId): Observable<TodoListModel> {
    const todoListDetailsURL = BASE_URL + '/api/docket/todo/' + todoListId;
    return this.http.get<TodoListModel>(todoListDetailsURL);
    // return this.http.get<TodoListModel>('http://localhost:4200/assets/mock-data/todos-' + todoListId + '.json');
  }

}
