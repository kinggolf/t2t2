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

  deleteTodoList(todoListId): Observable<any> {
    const deleteListURL = BASE_URL + '/api/docket/todo/' + todoListId;
    return this.http.delete(deleteListURL);
  }

  createNewTodo(todoListId, newTodoLabel): Observable<TodoListModel> {
    console.log('In createNewTodo, newTodoLabel = ' + newTodoLabel);
    const createNewTodoURL = BASE_URL + '/api/docket/todo/' + todoListId;
    const createNewTodoBody = {
      label: newTodoLabel
    };
    return this.http.post<TodoListModel>(createNewTodoURL, createNewTodoBody);
  }

  updateTodo(todoItemId, updatedTodoLabel, completed): Observable<TodoListModel> {
    console.log('In updateTodo, updatedTodoLabel = ' + updatedTodoLabel);
    const updateListURL = BASE_URL + '/api/docket/todo/item/' + todoItemId;
    let updateListBody;
    if (updatedTodoLabel !== '') {
      updateListBody = {
        op: 'replace',
        path: '/label',
        value: updatedTodoLabel
      };
    } else {
      updateListBody = {
        op: 'replace',
        path: '/completed',
        value: completed
      };
    }
    return this.http.patch<any>(updateListURL, updateListBody);
  }

  deleteTodo(todoItemId): Observable<any> {
    const deleteTodoURL = BASE_URL + '/api/docket/todo/item/' + todoItemId;
    return this.http.delete(deleteTodoURL);
  }

}
