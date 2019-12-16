import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike, Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { FirestoreService } from './services/firestore.service';
import { AppHealthService } from './services/app-health.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { WizardComponent } from './components/wizard/wizard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: firebase.User;
  currentUserSub: SubscriptionLike;
  isOnline$: Observable<boolean>;
  loginTimerExpired: boolean;
  newUser: boolean;

  constructor(private firestoreService: FirestoreService, private appHealthService: AppHealthService,
              private bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {
    this.newUser = this.loginTimerExpired = false;
    setTimeout(() => {
      this.loginTimerExpired = true;
    }, 1500);
    this.currentUserSub = this.firestoreService.getUser().subscribe(user => {
      this.currentUser = user;
      if (this.currentUser && this.newUser) {
        this.showHelp();
      }
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

  showHelp() {
    this.bottomSheet.open(WizardComponent);
  }

  registering(newUser) {
    if (newUser && this.currentUser) {
      this.bottomSheet.open(WizardComponent);
    }
  }

}
