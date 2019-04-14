import { Component, OnInit, Input } from '@angular/core';
import { TodoListModel } from '../../models';
import { FirestoreService } from '../../services/firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit {
  @Input() userTodoList: TodoListModel;
  @Input() userDocId: string;
  editingTodoLabelIndex: number;
  newTodoLabel: FormGroup;

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.editingTodoLabelIndex = -1;
    this.newTodoLabel = this.fb.group({
      newItemLabel: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    console.log('In TodosComponent: this.userTodoList = ', this.userTodoList);
  }

  toggleTodoComplete(i): void {
    const updatedTodo = { ...this.userTodoList.todos[i], completed: !this.userTodoList.todos[i].completed };
    const updatedTodos = [ ...this.userTodoList.todos.slice(0, i), updatedTodo, ...this.userTodoList.todos.slice(i + 1) ];
    this.updateTodoList(i, updatedTodos);
  }

  editTodoLabel(i): void {
    this.newTodoLabel = this.fb.group({ newLabel: [this.userTodoList.todos[i].label,
        Validators.compose([Validators.required, Validators.minLength(1)])] });
    this.editingTodoLabelIndex = i;
  }

  cancelEditDetails(i): void {
    this.editingTodoLabelIndex = -1;
    if (this.userTodoList.todos[i].label === '') {
      const updatedTodos = [ ...this.userTodoList.todos.slice(0, i), ...this.userTodoList.todos.slice(i + 1) ];
      this.updateTodoList(i, updatedTodos);
    }
  }

  saveEditLabel(i): void {
    this.editingTodoLabelIndex = -1;
    const updatedTodo = { ...this.userTodoList.todos[i], label: this.newTodoLabel.value.newLabel };
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
  }

}
