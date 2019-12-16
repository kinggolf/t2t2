import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { TodoListModel, TodoModel } from '../../models';
import { FirestoreService } from '../../services/firestore.service';
import { TodosUtilService } from '../../services/todos-util.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as moment from 'moment';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['../../app.component.scss', './todos.component.scss'],
})
export class TodosComponent implements OnInit {
  @Input() userTodoList: TodoListModel;
  @Input() userDocId: string;
  @Output() cancelEditTodoLabel = new EventEmitter();
  editingTodoLabelIndex: number;
  editTodoForm: FormGroup;
  @ViewChildren('todoList', { read: ElementRef }) todoList: QueryList<ElementRef>;

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService, private todosUtilService: TodosUtilService) {}

  ngOnInit(): void {
    this.editingTodoLabelIndex = -1;
    this.editTodoForm = this.fb.group({
      label: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      description: [''],
      date: [''],
      time: ['']
    });
  }

  drop(event: CdkDragDrop<TodoModel[]>) {
    this.todosUtilService.moveTodo(event.previousIndex, event.currentIndex, this.userDocId, this.userTodoList, true);
  }

  toggleTodoComplete(i): void {
    const updatedTodo = { ...this.userTodoList.todos[i], completed: !this.userTodoList.todos[i].completed };
    const updatedTodos = [ ...this.userTodoList.todos.slice(0, i), updatedTodo, ...this.userTodoList.todos.slice(i + 1) ];
    this.updateTodoList(i, updatedTodos);
  }

  editTodo(i): void {
    this.editTodoForm = this.fb.group({
      label: [this.userTodoList.todos[i].label,
        Validators.compose([Validators.required, Validators.minLength(1)])],
      description: [this.userTodoList.todos[i].description]
    });
    if (this.userTodoList.listName === 'Appointments') {
      if (this.userTodoList.todos[i].date) {
        this.editTodoForm.addControl('date', new FormControl(moment(this.userTodoList.todos[i].date)));
        this.editTodoForm.addControl('time', new FormControl(this.userTodoList.todos[i].time));
      } else {
        this.editTodoForm.addControl('date', new FormControl(moment()));
        this.editTodoForm.addControl('time', new FormControl(''));
      }
    }
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
      description: this.editTodoForm.value.description,
      // dateAndTime: this.combineDateAndTime(this.editTodoForm.value.date, this.editTodoForm.value.time),
      date: this.editTodoForm.value.date.format('ddd MMM DD, YYYY'),
      time: this.editTodoForm.value.time
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

  combineDateAndTime(date: moment.Moment, time: string): string {
    const timeA = time.split(':');
    const timeB = timeA[1].split(' ');
    timeB[1] === 'AM' ? date.hour(parseInt(timeA[0], 10)) : date.hour(parseInt(timeA[0], 10) + 12);
    date.minute(parseInt(timeB[0], 10));
    return date.toString();
  }

  parseDateAndTime(dateAndTime: moment.Moment): { date: moment.Moment, time: string } {
    let hours = dateAndTime.hours();
    let ampm = 'AM';
    if (hours > 11) {
      hours = hours - 12;
      ampm = 'PM';
    }
    console.log('dateAndTime = ', dateAndTime);
    return { date: dateAndTime, time: `${hours}:${dateAndTime.minutes()} ${ampm}` };
  }
}
