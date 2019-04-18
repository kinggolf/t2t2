import { Injectable } from '@angular/core';
import { TodoListModel, TodoModel } from '../models';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class TodosUtilService {

  constructor(private firestoreService: FirestoreService) {}

  moveTodoList(prevIndex: number, curIndex: number, userDocId: string, userTodoLists: TodoListModel[], movingListOnly: boolean) {
    let tempTodoList: TodoListModel;
    let tempTodoListDocId: string;
    if (prevIndex > curIndex) {
      // Then moving a list up
      for (let i = prevIndex - 1; i > curIndex - 1; i--) {
        tempTodoList = { ...userTodoLists[i], orderIndex: i + 1 };
        tempTodoListDocId = userTodoLists[i].todoListDocId;
        delete tempTodoList.todoListDocId;
        this.firestoreService.updateTodoList(userDocId, tempTodoListDocId, tempTodoList);
      }
    } else if (prevIndex < curIndex) {
      // Then moving a list down
      for (let i = prevIndex + 1; i < curIndex + 1; i++) {
        tempTodoList = { ...userTodoLists[i], orderIndex: i - 1 };
        tempTodoListDocId = userTodoLists[i].todoListDocId;
        delete tempTodoList.todoListDocId;
        this.firestoreService.updateTodoList(userDocId, tempTodoListDocId, tempTodoList);
      }
    }
    if (movingListOnly) {
      const movedTodoList = {...userTodoLists[prevIndex], orderIndex: curIndex};
      const movedTodoListDocId = movedTodoList.todoListDocId;
      delete movedTodoList.todoListDocId;
      this.firestoreService.updateTodoList(userDocId, movedTodoListDocId, movedTodoList);
    }
  }

  moveTodo(prevIndex: number, curIndex: number, userDocId: string, todoList: TodoListModel, movingTodoOnly: boolean) {
    const copyOfTodos = [ ...todoList.todos ];
    let tempTodo: TodoModel[];
    let reorderedTodos: TodoModel[];
    if (prevIndex < copyOfTodos.length - 1) {
      tempTodo = copyOfTodos.slice(prevIndex, prevIndex + 1);
    } else {
      tempTodo = copyOfTodos.slice(prevIndex);
    }
    if (prevIndex > curIndex) {
      // Then moving an item up
      reorderedTodos = [
        ...copyOfTodos.slice(0, curIndex),
        ...tempTodo,
        ...copyOfTodos.slice(curIndex, prevIndex),
        ...copyOfTodos.slice(prevIndex + 1)
      ];
      const updatedList = { ...todoList, todos: reorderedTodos };
      this.firestoreService.updateTodoList(userDocId, todoList.todoListDocId, updatedList);
    } else if (prevIndex < curIndex) {
      // Then moving an item down
      reorderedTodos = [
        ...copyOfTodos.slice(0, prevIndex),
        ...copyOfTodos.slice(prevIndex + 1, curIndex + 1),
        ...tempTodo,
        ...copyOfTodos.slice(curIndex + 1)
      ];
      const updatedList = { ...todoList, todos: reorderedTodos };
      this.firestoreService.updateTodoList(userDocId, todoList.todoListDocId, updatedList);
    }
  }

}
