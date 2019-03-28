import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL, TodoListModel } from '../models';
import { Observable, SubscriptionLike } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  serverSub: SubscriptionLike;

  constructor(private http: HttpClient) {}

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

  updateList(updatedList, name): void {
    const updateListURL = BASE_URL + '/api/docket/todo/' + updatedList.id;
    let updateListBody;
    if (name === 'name') {
      updateListBody = {
        op: 'replace',
        path: '/name',
        value: updatedList.name
      };
    }
    if (this.serverSub) {
      this.serverSub.unsubscribe();
    }
    this.serverSub = this.http.patch<any>(updateListURL, updateListBody).subscribe();
  }

  deleteTodoList(todoListId): Observable<any> {
    const deleteListURL = BASE_URL + '/api/docket/todo/' + todoListId;
    return this.http.delete(deleteListURL);
  }

  createNewTodo(todoListId, newTodoLabel): Observable<TodoListModel> {
    const createNewTodoURL = BASE_URL + '/api/docket/todo/' + todoListId;
    const createNewTodoBody = {
      label: newTodoLabel
    };
    return this.http.post<TodoListModel>(createNewTodoURL, createNewTodoBody);
  }

  updateTodo(todoItemId, updatedTodoLabel, completed): void {
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
    if (this.serverSub) {
      this.serverSub.unsubscribe();
    }
    this.serverSub = this.http.patch<any>(updateListURL, updateListBody).subscribe();
  }

  deleteTodo(todoItemId): Observable<any> {
    const deleteTodoURL = BASE_URL + '/api/docket/todo/item/' + todoItemId;
    return this.http.delete(deleteTodoURL);
  }

}
