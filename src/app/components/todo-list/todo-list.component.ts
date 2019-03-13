import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel, TodoModel } from '../../models';
import { SubscriptionLike } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { TodoListDetailsAction, TodoListsAction, CreatingNewListAction, CreatingNewTodoAction,
         PrevTodoListsAction, PrevTodoListDetailsAction } from '../../actions';
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
  creatingNewTodoSub: SubscriptionLike;
  currentOpenListIndex: number;
  newTodoListName: FormGroup;
  creatingNewList: boolean;
  creatingNewTodo: boolean;

  constructor(private todosService: TodosService, private store: Store<APPStore>, private fb: FormBuilder) { }

  ngOnInit() {
    this.todoListsSub = this.store.select('todoLists').subscribe(todoList => {
      console.log('In ngOnInit, todoList = ', todoList);
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
    // Use creatingNewTodo to prevent multiple create todos from being open at the same time
    this.creatingNewTodoSub = this.store.select('creatingNewTodo').subscribe(creatingNewTodo => {
      this.creatingNewTodo = creatingNewTodo;
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
    if (this.creatingNewTodoSub) {
      this.creatingNewTodoSub.unsubscribe();
    }
  }

  showListDetails(i): void {
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
          this.store.dispatch(new TodoListDetailsAction(Object.assign({}, listDetails)));
          // this.store.dispatch(new TodoListDetailsAction(listDetails));
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
      this.store.dispatch(new PrevTodoListsAction(prevTodoLists));
    }).unsubscribe();
    this.todoLists[i].editingName = true;
    this.newTodoListName = this.fb.group({
      newListName: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
  }

  saveNameOrLabel(i): void {
    this.clearAddedList(i, 'Save');
    if (this.creatingNewList) {
      this.todosService.createNewList(this.newTodoListName.value.newListName).subscribe(newTodoListObj => {
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
      this.store.dispatch((new TodoListsAction([
        ...this.todoLists.slice(0, i),
        ...[updatedList],
        ...this.todoLists.slice(i + 1)
      ])));
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
    this.store.dispatch(new CreatingNewListAction(false));
  }

  createNewTodo(i): void {
    console.log('Create new Todo to this list, i = ' + i + ' & this.currentOpenListIndex = ' + this.currentOpenListIndex);
    if (!this.creatingNewTodo) {
      this.store.dispatch(new CreatingNewTodoAction(true));
      const newTodo: TodoModel[] = [];
      newTodo.push({
        id: '',
        label: '',
        completed: false,
        editingTask: true
      });
      if (this.currentOpenListIndex === i) {
        // adding todo to already open list details, so add blank todo with open form, index 0
        let newTodoListItems: TodoModel[];
        let prevTodoListDetails: TodoListModel;
        this.store.select('todoListDetails').subscribe(listDetails => {
          prevTodoListDetails = Object.assign({}, listDetails);
          this.store.dispatch(new PrevTodoListDetailsAction(prevTodoListDetails));
          newTodoListItems = [
            ...newTodo,
            ...listDetails.items
          ];
        }).unsubscribe();
        this.store.dispatch(new TodoListDetailsAction(Object.assign(prevTodoListDetails, {items: newTodoListItems})));
      } else {
        if (this.currentOpenListIndex > -1) {
          // Another list is open, so must close 1st
          this.todoLists[this.currentOpenListIndex].showListDetails = false;
        }
        if ((this.todoLists[i].itemsPending + this.todoLists[i].itemsCompleted) > 0) {
          // Fetch list details
          this.todosSub = this.todosService.getTodoListDetails(this.todoLists[i].id).subscribe(listDetails => {
            listDetails.showListDetails = this.todoLists[i].showListDetails = true;
            this.store.dispatch(
              new TodoListDetailsAction(Object.assign(listDetails, {
                items: [
                  ...newTodo,
                  ...listDetails.items
                ]
              }, {showListDetails: true}))
            );
            this.currentOpenListIndex = i;
          });
        } else {
          // This list has no todos
          console.log('Create new Todo - no todos!, this.todoLists[i] = ', this.todoLists[i]);
          console.log('newTodo = ', newTodo);
          this.store.dispatch(
            new TodoListDetailsAction(Object.assign(this.todoLists[i], {items: newTodo}, {showListDetails: true}))
          );
        }
      }
    }
  }

  addNewTodoToListDetails() {

  }

  /*
  createNewTodo(listIndex): void {
    console.log('Create new Todo to this list, listIndex = ' + listIndex);
    if (!this.creatingNewTodo) {
      let prevTodoLists: TodoListModel[];
      // Use prevTodoLists to store current lists & revert back to this if user cancels creating a new list
      this.store.select('todoLists').subscribe(todoLists => {
        prevTodoLists = todoLists.slice(0);
        this.store.dispatch(new PrevTodoListsAction(prevTodoLists));
      }).unsubscribe();
      const newTodo: TodoModel[] = [];
      newTodo.push({
        id: '',
        label: '',
        completed: false,
        editingTask: true
      });
      let newTodoListItems = [];
      if (prevTodoLists[listIndex].items) {
        newTodoListItems = [
          ...newTodo,
          ...prevTodoLists[listIndex].items
        ];
      } else {
        newTodoListItems = [
          ...newTodo,
        ];
      }
      const listWithAddTodo = [];
      listWithAddTodo.push(
        Object.assign(prevTodoLists[listIndex], {items: newTodoListItems})
      );
      this.store.dispatch(new TodoListsAction(([
        ...prevTodoLists.slice(0, listIndex),
        ...listWithAddTodo,
        ...prevTodoLists.slice(listIndex + 1)
      ])));
      this.store.dispatch(new CreatingNewTodoAction(true));
    }
  } */

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
