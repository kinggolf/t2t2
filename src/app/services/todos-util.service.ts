import { Injectable } from '@angular/core';
import { TodoListModel } from '../models';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class TodosUtilService {

  constructor(private firestoreService: FirestoreService) {}

  moveTodoList(prevIndex, curIndex, userDocId, userTodoLists, movingListOnly: boolean) {
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

}
