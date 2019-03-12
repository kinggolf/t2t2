import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel } from '../../models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { TodoListDetailsAction, TodoListsAction, CreatingNewListAction,
         PrevTodoListsAction } from '../../actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todosSub: SubscriptionLike;
  todoLists: TodoListModel[];
  todoListsSub: SubscriptionLike;
  creatingNewListSub: SubscriptionLike;
  currentOpenListIndex: number;
  newTodoListName: FormGroup;
  creatingNewList: boolean;

  constructor(private todosService: TodosService, private store: Store<APPStore>, private fb: FormBuilder) { }

  ngOnInit() {
    this.todoListsSub = this.store.select('todoLists').subscribe(todoList => {
      if (todoList) {
        this.todoLists = todoList;
      }
    });
    this.creatingNewListSub = this.store.select('creatingNewList').subscribe(creatingNewList => {
      this.creatingNewList = creatingNewList;
      if (creatingNewList) {
        this.newTodoListName = this.fb.group({
          newListName: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
        });
      }
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
    if (this.creatingNewListSub) {
      this.creatingNewListSub.unsubscribe();
    }
  }

  showTodos(i): void {
    if ((this.todoLists[i].itemsPending + this.todoLists[i].itemsCompleted) > 0) {
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
  }

  editListName(i): void {
    let prevTodoLists: TodoListModel[];
    // Use prevTodoLists to store current lists & revert back to this if user cancels editing a list name
    this.store.select('todoLists').subscribe(todoLists => {
      prevTodoLists = todoLists.slice(0);
      // prevTodoLists = Object.assign(todoLists);
      this.store.dispatch(new PrevTodoListsAction(prevTodoLists));
    }).unsubscribe();
    this.todoLists[i].editingName = true;
    this.newTodoListName = this.fb.group({
      newListName: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    console.log('In editListName, this.todoLists = ', this.todoLists);
  }

  saveEditName(i): void {
    this.clearAddedList(i, 'Save');
    if (this.creatingNewList) {
      this.todosService.createNewList(this.newTodoListName.value.newListName).subscribe(newTodoListObj => {
        // console.log('First slice = ', ...this.todoLists.slice(0, i));
        // console.log('newTodoList = ', [newTodoListObj]);
        // console.log('Final slice = ', ...this.todoLists.slice(i + 1));
        this.store.dispatch((new TodoListsAction([
          ...this.todoLists.slice(0, i),
          ...[newTodoListObj],
          ...this.todoLists.slice(i + 1)
        ])));
      });
    } else {
      // Updating name of an existing list
      // const updatedList = Object.assign({}, this.todoLists[i], {name: this.newTodoListName.value.newListName});
      const updatedList = Object.assign({
        ...this.todoLists[i],
        name: this.newTodoListName.value.newListName
      });
      console.log('In saveEditName, updatedList = ', updatedList);
      this.todosService.updateList(updatedList, 'name').subscribe(resp => {
        console.log('In saveEditName, resp = ', resp);
      });
    }
    this.todoLists[i].editingName = false;
  }

  clearAddedList(i, saveOrCancel): void {
    this.todoLists[i].editingName = false;
    this.store.select('prevTodoLists').subscribe(prevTodoLists => {
      this.store.dispatch((new TodoListsAction(prevTodoLists)));
    }).unsubscribe();
    /*
    if ((saveOrCancel !== 'Save' && !this.todoLists[i].editingName) || this.creatingNewList) {
      this.store.dispatch((new TodoListsAction([
        ...this.todoLists.slice(1)
      ])));
    } */
    this.store.dispatch(new CreatingNewListAction(false));
  }

  addTodoToList(i): void {
    console.log('Add Todo to this list, i = ' + i);
  }

  confirmDeleteList(i): void {
    const confirmDelete = window.confirm('Confirm Delete ' + this.todoLists[i].name);
    if (confirmDelete) {
      this.todosService.deleteList(this.todoLists[i].id).subscribe( resp => {
        if (!resp) {
          // Remove this list from store
          this.store.dispatch(new TodoListsAction([
            ...this.todoLists.slice(0, i),
            ...this.todoLists.slice(i + 1)
          ]));
        } else {
          console.log('deleteList response = ', resp);
        }
      });
    }
  }

}
