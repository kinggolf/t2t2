import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { state, style, transition, trigger, animate } from '@angular/animations';
import {TodoListDetailsAction, TodoListsAction} from '../../actions';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  animations: [
    trigger('opening', [
      state('show', style({height: '*', })),
      state('hide', style({overflow: 'hidden', height: 0})),
      transition('hide => show', [
        style({overflow: 'hidden', height: 0}),
        animate('200ms ease-out', style({height: '*'}))
      ]),
      transition('show => hide', [
        style({overflow: 'hidden', height: '*'}),
        animate('200ms ease-out', style({height: '0px'}))
      ])
    ]),
  ]
})
export class TodoListComponent implements OnInit, OnDestroy {
  todosSub: SubscriptionLike;
  todoLists: TodoListModel[];
  todoListsSub: SubscriptionLike;
  currentOpenListIndex: number;

  constructor(private todosService: TodosService, private store: Store<APPStore>) { }

  ngOnInit() {
    this.todoListsSub = this.store.select('todoLists').subscribe(todoList => {
      this.todoLists = todoList;
    });
    this.currentOpenListIndex = -1;
  }

  ngOnDestroy(): void {
    if (this.todoListsSub) {
      this.todoListsSub.unsubscribe();
    }
    if (this.todosSub) {
      this.todosSub.unsubscribe();
    }
  }

  showTodos(i) {
    if (this.currentOpenListIndex === i) {
      this.todoLists[i].showListDetails = this.todoLists[i].editingName = false;
      this.currentOpenListIndex = -1;
    } else {
      if (this.currentOpenListIndex > -1) {
        this.todoLists[this.currentOpenListIndex].showListDetails = false;
      }
      this.todosSub = this.todosService.getTodoListDetails(this.todoLists[i].id).subscribe(listDetails => {
        listDetails.showListDetails = this.todoLists[i].showListDetails = true;
        this.store.dispatch(new TodoListDetailsAction(listDetails));
        this.currentOpenListIndex = i;
      });
    }
  }

  toggleListComplete(i) {
    console.log('Toggle this list complete, i = ' + i);
  }

  editListInfo(i) {
    this.todoLists[i].editingName = true;
  }

  cancelEditName(i) {
    this.todoLists[i].editingName = false;
    if (this.todoLists[i].id === '') {
      this.store.dispatch(new TodoListsAction(this.todoLists.slice(0, this.todoLists.length - 1)));
    }}

  saveEditName(i) {
    this.todoLists[i].editingName = false;
    // Save this new name
  }

  addTodoToList(i) {
    console.log('Add Todo to this list, i = ' + i);
  }

  deleteList(i) {
    console.log('Delete this list, i = ' + i);
  }
}
