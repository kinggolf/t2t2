import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { Observable, SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { state, style, transition, trigger, animate } from '@angular/animations';
import { TodoListDetailsAction } from '../../actions';

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
  todoLists$: Observable<TodoListModel[]>;
  todosSub: SubscriptionLike;
  todoLists: TodoListModel[];
  todoListsSub: SubscriptionLike;
  currentOpenListIndex: number;

  constructor(private todosService: TodosService, private store: Store<APPStore>) { }

  ngOnInit() {
    this.todoLists$ = this.store.select('todoLists');
    this.todoListsSub = this.todoLists$.subscribe(todoList => {
      this.todoLists = todoList;
    });
    this.currentOpenListIndex = -1;
  }

  ngOnDestroy(): void {
    this.todoListsSub.unsubscribe();
    this.todosSub.unsubscribe();
  }

  showTodos(i) {
    if (this.currentOpenListIndex === i) {
      this.todoLists[i].showListDetails = false;
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
    console.log('Edit this list info, i = ' + i);
  }

  addTodoToList(i) {
    console.log('Add Todo to this list, i = ' + i);
  }

  deleteList(i) {
    console.log('Delete this list, i = ' + i);
  }
}
