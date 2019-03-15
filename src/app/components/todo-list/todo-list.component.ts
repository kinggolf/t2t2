import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { APPStore, TodoListModel, TodoModel } from '../../models';
import { SubscriptionLike, Observable } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { TodoListDetailsAction, TodoListsAction, CreatingNewListAction, CreatingNewTodoAction,
         PrevTodoListsAction, PrevTodoListDetailsAction, UpdateListDetailsLoadingAction } from '../../actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todosHttpSub: SubscriptionLike;
  todoLists: TodoListModel[];
  todoListsSub: SubscriptionLike;
  creatingNewListSub: SubscriptionLike;
  creatingNewTodoSub: SubscriptionLike;
  todoListDetails: TodoListModel;
  todoListDetailsSub: SubscriptionLike;
  todoListDetailsLoading$: Observable<boolean>;
  currentOpenListIndex: number;
  newTodoListName: FormGroup;
  creatingNewList: boolean;
  creatingNewTodo: boolean;

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
    // Use creatingNewTodo to prevent multiple create todos from being open at the same time
    this.creatingNewTodoSub = this.store.select('creatingNewTodo').subscribe(creatingNewTodo => {
      this.creatingNewTodo = creatingNewTodo;
    });
    this.currentOpenListIndex = -1;
    this.todoListDetailsLoading$ = this.store.select('listDetailsLoading');
  }

  ngOnDestroy(): void {
    if (this.todoListsSub) {
      this.todoListsSub.unsubscribe();
    }
    if (this.todosHttpSub) {
      this.todosHttpSub.unsubscribe();
    }
    if (this.todoListDetailsSub) {
      this.todoListDetailsSub.unsubscribe();
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
        // Needed for offline mode
        this.store.dispatch(new TodoListDetailsAction(null));
      } else {
        if (this.currentOpenListIndex > -1) {
          this.todoLists[this.currentOpenListIndex].showListDetails = false;
        }
        this.store.dispatch(new UpdateListDetailsLoadingAction(true));
        this.todoLists[i].showListDetails = true;
        this.todosHttpSub = this.todosService.getTodoListDetails(this.todoLists[i].id).subscribe(listDetails => {
          listDetails.showListDetails = true;
          this.store.dispatch(new TodoListDetailsAction(Object.assign({}, listDetails)));
          this.currentOpenListIndex = i;
          this.store.dispatch(new UpdateListDetailsLoadingAction(false));
        });
      }
      // Subscribe to todoListDetail in case there are updates to the list details in todo.component
      this.todoListDetailsSub = this.store.select('todoListDetails').subscribe(listDetails => {
        if (!this.creatingNewTodo) {
          if (listDetails) {
            let completedTodos = 0;
            let pendingTodos = 0;
            listDetails.items.map(item => {
              if (item.completed) {
                completedTodos = completedTodos + 1;
              } else {
                pendingTodos = pendingTodos + 1;
              }
            });
            const updatedTodoList = Object.assign(
              this.todoLists[i],
              {itemsCompleted: completedTodos},
              {itemsPending: pendingTodos});
            const updatedTodoLists = [
              ...this.todoLists.slice(0, i),
              updatedTodoList,
              ...this.todoLists.slice(i + 1),
            ];
            this.store.dispatch(new TodoListsAction(updatedTodoLists));
          }
        }
      });
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
      newListName: [this.todoLists[i].name, Validators.compose([Validators.required, Validators.minLength(1)])]
    });
  }

  saveEditName(i): void {
    this.todoLists[i].editingName = false;
    this.store.select('prevTodoLists').subscribe(prevTodoLists => {
      this.store.dispatch((new TodoListsAction(prevTodoLists)));
    }).unsubscribe();
    if (this.creatingNewList) {
      this.todosService.createNewList(this.newTodoListName.value.newListName).subscribe(newTodoListObj => {
        this.store.dispatch((new TodoListsAction([
          ...[newTodoListObj],
          ...this.todoLists.slice(0)
        ])));
      });
    } else {
      // Updating name of an existing list
      const updatedList = Object.assign({
        ...this.todoLists[i],
        name: this.newTodoListName.value.newListName
      });
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
    this.store.dispatch(new CreatingNewListAction(false));
  }

  createNewTodo(i): void {
    if (!this.creatingNewTodo) {
      this.store.dispatch(new CreatingNewTodoAction(true));
      const newTodo: TodoModel[] = [];
      newTodo.push({
        id: '',
        label: '',
        completed: false,
        editingTask: true
      });
      let newTodoListItems: TodoModel[];
      let prevTodoListDetails: TodoListModel;
      if (this.currentOpenListIndex === i) {
        // adding item to already open list details, so add blank item with open form, index 0
        this.store.select('todoListDetails').subscribe(listDetails => {
          prevTodoListDetails = Object.assign({}, listDetails);
          this.store.dispatch(new PrevTodoListDetailsAction(Object.assign({}, listDetails)));
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
          this.todosHttpSub = this.todosService.getTodoListDetails(this.todoLists[i].id).subscribe(listDetails => {
            listDetails.showListDetails = this.todoLists[i].showListDetails = true;
            // prevTodoListDetails = Object.assign({}, listDetails);
            this.store.dispatch(new PrevTodoListDetailsAction(Object.assign({}, listDetails)));
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
          this.store.dispatch(new PrevTodoListDetailsAction(null));
          const todoLists3 = Object.assign({}, this.todoLists[i]);
          this.todoLists[i].showListDetails = true;
          this.store.dispatch(
            new TodoListDetailsAction(Object.assign(todoLists3, {items: newTodo}, {showListDetails: true}))
          );
        }
      }
    }
  }

  cancelEditListName(i): void {
    this.todoLists[i].editingName = false;
    this.store.select('prevTodoLists').subscribe(prevTodoLists => {
      this.store.dispatch((new TodoListsAction(prevTodoLists)));
    }).unsubscribe();
    this.store.dispatch(new CreatingNewListAction(false));
  }


  confirmDeleteList(i): void {
    const confirmDelete = window.confirm('Confirm Delete ' + this.todoLists[i].name);
    if (confirmDelete) {
      this.todosService.deleteTodoList(this.todoLists[i].id).subscribe(resp => {
        if (!resp) {
          // Remove this list from store
          this.store.dispatch(new TodoListsAction([
            ...this.todoLists.slice(0, i),
            ...this.todoLists.slice(i + 1)
          ]));
        } else {
          console.log('deleteTodoList response = ', resp);
        }
      });
    }
  }

}
