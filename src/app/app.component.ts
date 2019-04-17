import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike, Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { FirestoreService } from './services/firestore.service';
import { AppHealthService } from './services/app-health.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: firebase.User;
  currentUserSub: SubscriptionLike;
  isOnline$: Observable<boolean>;
  loginTimerExpired: boolean;

  constructor(private firestoreService: FirestoreService, private appHealthService: AppHealthService) {}

  ngOnInit(): void {
    this.loginTimerExpired = false;
    setTimeout(() => {
      this.loginTimerExpired = true;
    }, 1500);
    this.currentUserSub = this.firestoreService.getUser().subscribe(user => {
      this.currentUser = user;
      console.log('this.currentUser = ', this.currentUser);
    });
    this.firestoreService.initAuthState();
    this.isOnline$ = this.appHealthService.monitorOnline();
  }

  ngOnDestroy(): void {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
  }

}
