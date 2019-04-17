import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoListModel, TodoModel } from '../../models';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit {
  @Input() userTodoList: TodoListModel;
  @Input() userDocId: string;
  @Output() cancelEditTodoLabel = new EventEmitter();
  editingTodoLabelIndex: number;
  editTodoForm: FormGroup;

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.editingTodoLabelIndex = -1;
    this.editTodoForm = this.fb.group({
      label: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      description: ['']
    });
  }

  drop(event: CdkDragDrop<TodoModel[]>) {
    this.moveTodo(event.previousIndex, event.currentIndex);
  }

  moveTodo(prevIndex, curIndex) {
    const copyOfTodos = [ ...this.userTodoList.todos ];
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
      const updatedList = { ...this.userTodoList, todos: reorderedTodos };
      this.firestoreService.updateTodoList(this.userDocId, this.userTodoList.todoListDocId, updatedList);
    } else if (prevIndex < curIndex) {
      // Then moving an item down
      reorderedTodos = [
        ...copyOfTodos.slice(0, prevIndex),
        ...copyOfTodos.slice(prevIndex + 1, curIndex + 1),
        ...tempTodo,
        ...copyOfTodos.slice(curIndex + 1)
      ];
      const updatedList = { ...this.userTodoList, todos: reorderedTodos };
      this.firestoreService.updateTodoList(this.userDocId, this.userTodoList.todoListDocId, updatedList);
    }
  }

  toggleTodoComplete(i): void {
    const updatedTodo = { ...this.userTodoList.todos[i], completed: !this.userTodoList.todos[i].completed };
    const updatedTodos = [ ...this.userTodoList.todos.slice(0, i), updatedTodo, ...this.userTodoList.todos.slice(i + 1) ];
    this.updateTodoList(i, updatedTodos);
  }

  editTodo(i): void {
    this.editTodoForm = this.fb.group({ label: [this.userTodoList.todos[i].label,
        Validators.compose([Validators.required, Validators.minLength(1)])],
      description: [this.userTodoList.todos[i].description] });
    this.editingTodoLabelIndex = i;
  }

  cancelEditDetails(i): void {
    this.editingTodoLabelIndex = -1;
    if (this.userTodoList.todos[i].label === '') {
      const updatedTodos = [ ...this.userTodoList.todos.slice(0, i), ...this.userTodoList.todos.slice(i + 1) ];
      this.updateTodoList(i, updatedTodos);
    }
    this.cancelEditTodoLabel.emit();
  }

  saveEditTodo(i): void {
    this.editingTodoLabelIndex = -1;
    const updatedTodo = {
      ...this.userTodoList.todos[i],
      label: this.editTodoForm.value.label,
      description: this.editTodoForm.value.description
    };
    const updatedTodos = [ ...this.userTodoList.todos.slice(0, i), updatedTodo, ...this.userTodoList.todos.slice(i + 1) ];
    this.updateTodoList(i, updatedTodos);
  }

  deleteTodo(i): void {
    const confirmDelete = window.confirm('Confirm Delete ' + this.userTodoList.todos[i].label);
    if (confirmDelete) {
      const updatedTodos = [ ...this.userTodoList.todos.slice(0, i), ...this.userTodoList.todos.slice(i + 1) ];
      this.updateTodoList(i, updatedTodos);
    }
  }

  updateTodoList(i, updatedTodos): void {
    const updatedList = { ...this.userTodoList, todos: updatedTodos };
    this.firestoreService.updateTodoList(this.userDocId, this.userTodoList.todoListDocId, updatedList);
    this.cancelEditTodoLabel.emit();
  }

}
