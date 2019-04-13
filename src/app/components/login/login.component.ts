import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../models';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  @Output() loginObject = new EventEmitter();

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.min(5)])],
    });
  }

  googleSignIn() {
    this.firestoreService.authGoogleLogin();
  }

  submitLogin() {
    this.firestoreService.authLogin(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
  }

  forgotPassword() {
    this.firestoreService.authForgotPassword(this.loginForm.controls.email.value);
  }

}
