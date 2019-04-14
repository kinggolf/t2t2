import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  showLogin: boolean;

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService) { }

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
  }

  passwordMatchValidator(c: AbstractControl): ValidationErrors | null {
    const noMatch = c.get('password').value !== c.get('confirmPassword').value;
    return noMatch ? {passwordConfirmFail: true} : null;
  }

  googleSignIn() {
    this.firestoreService.authGoogleLoginRegistration();
  }

  submitLogin() {
    this.firestoreService.authLogin(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
  }

  submitRegister() {
    this.firestoreService.createNewUser(this.registerForm.controls.email.value, this.registerForm.controls.password.value);
  }

  forgotPassword() {
    this.firestoreService.authForgotPassword(this.loginForm.controls.email.value);
  }

  switchToRegister() {
    this.showLogin = !this.showLogin;
  }
}
