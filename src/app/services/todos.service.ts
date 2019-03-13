import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { APPStore, BASE_URL, TodoListModel, TodoModel } from '../models';
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

  updateList(updatedList, name): Observable<TodoListModel> {
    const updateListURL = BASE_URL + '/api/docket/todo/' + updatedList.id;
    let updateListBody;
    if (name === 'name') {
      updateListBody = {
        op: 'replace',
        path: '/name',
        value: updatedList.name
      };
    }
    return this.http.patch<any>(updateListURL, updateListBody);
  }

  deleteList(todoListId): Observable<any> {
    const deleteListURL = BASE_URL + '/api/docket/todo/' + todoListId;
    return this.http.delete(deleteListURL);
  }

  createNewTodo(todoListId, newTodoName): Observable<TodoModel> {
    const createNewTodoURL = BASE_URL + '/api/docket/todo/' + todoListId;
    const createNewTodoBody = {
      label: newTodoName
    };
    return this.http.post<TodoModel>(createNewTodoURL, createNewTodoBody);
  }

  updateTodo(updatedList, nameOrCompleted): Observable<TodoListModel> {
    const updateListURL = BASE_URL + '/api/docket/todo/item/' + updatedList.id;
    let updateListBody;
    if (nameOrCompleted === 'name') {
      updateListBody = {
        op: 'replace',
        path: '/label',
        value: updatedList.name
      };
    }
    console.log('updateListURL = ' + updateListURL);
    console.log('updateListBody = ', updateListBody);
    return this.http.patch<any>(updateListURL, updateListBody);
  }
}
