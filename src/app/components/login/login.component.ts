import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APPStore } from '../../models';
import { LoginAction } from '../../actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  @Output() loginObject = new EventEmitter();

  constructor(private fb: FormBuilder, private store: Store<APPStore>) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['scotia.b.tester@gmail.com', Validators.compose([Validators.required])],
      password: ['surface!POINT73', Validators.compose([Validators.required, Validators.min(5)])],
    });
  }

  submit() {
    console.log(this.loginForm.value);
    // this.loginObject.emit(this.loginForm.value);
    this.store.dispatch(new LoginAction(this.loginForm.value));
  }
}
