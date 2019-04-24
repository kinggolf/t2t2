import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { AppHealthService } from '../../services/app-health.service';
import { MatSnackBar } from '@angular/material';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../app.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  showLogin: boolean;
  isOnlineSub: SubscriptionLike;
  @Output() registering = new EventEmitter();

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService,
              private snackBar: MatSnackBar, private appHealthService: AppHealthService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
    });
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      confirmPassword: ['', Validators.required],
    }, {validator: this.passwordMatchValidator});
    this.showLogin = true;
    let onlineChangeCount = 0;
    this.isOnlineSub = this.appHealthService.monitorOnline().subscribe(online => {
      if (!online) {
        this.snackBar.open('Offline - must be online to login.', 'Got it', {
          duration: 5000,
        });
      } else if (onlineChangeCount > 0) {
        this.snackBar.open('Online - login enabled.', 'OK', {
          duration: 5000,
        });
      }
    });
    onlineChangeCount++;
  }

  passwordMatchValidator(c: AbstractControl): ValidationErrors | null {
    const noMatch = c.get('password').value !== c.get('confirmPassword').value;
    return noMatch ? {passwordConfirmFail: true} : null;
  }

  googleSignIn(registering) {
    this.firestoreService.authGoogleLoginRegistration();
    this.registering.emit(registering);
  }

  submitLogin() {
    this.firestoreService.authLogin(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
    this.registering.emit(false);
  }

  submitRegister() {
    this.firestoreService.createNewUser(this.registerForm.controls.email.value, this.registerForm.controls.password.value);
    this.registering.emit(true);
  }

  forgotPassword() {
    this.firestoreService.authForgotPassword(this.loginForm.controls.email.value);
  }

  switchToRegister() {
    this.showLogin = !this.showLogin;
  }
}
