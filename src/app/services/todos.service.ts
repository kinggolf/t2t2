import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { APPStore, BASE_URL, SCOPE, TodoListModel, UserModel } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private http: HttpClient, private store: Store<APPStore>) {}

  getTodoLists(): Observable<TodoListModel[]> {
    const todoListsURL = BASE_URL + '/api/docket/todo';
    return this.http.get<TodoListModel[]>(todoListsURL);
  }

  getTodoListDetails(todoListId): Observable<TodoListModel> {
    const todoListDetailsURL = BASE_URL + '/api/docket/todo/' + todoListId;
    return this.http.get<TodoListModel>(todoListDetailsURL);
  }

  createNewList(newListName): Observable<TodoListModel> {
    const createNewListURL = BASE_URL + '/api/docket/todo';
    const createNewListBody = {
      name: newListName
    };
    return this.http.post<TodoListModel>(createNewListURL, createNewListBody);
  }
}
