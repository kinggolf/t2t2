import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserModel, TodoListModel, TodoModel } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser: UserModel;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = null;
  }

  submitLogin(loginObject) {
    console.log('In AppComponent, loginObject = ' , loginObject);
    this.authService.submitLogin(loginObject);
  }
}
