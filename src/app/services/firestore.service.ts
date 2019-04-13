import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, SubscriptionLike, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { auth } from 'firebase/app';
import { UserModel, TodoListModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService implements OnDestroy {
  private currentUserSubject = new ReplaySubject<firebase.User>();
  private currentUser: Observable<firebase.User> = this.currentUserSubject.asObservable();
  currentUserSub: SubscriptionLike;
  private userTodoListsSubject = new ReplaySubject<TodoListModel[]>();
  private userTodoLists: Observable<TodoListModel[]> = this.userTodoListsSubject.asObservable();
  userTodoListsSub: SubscriptionLike;

  constructor(private af: AngularFirestore, public firebaseAuth: AngularFireAuth) {}

  ngOnDestroy(): void {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
    if (this.userTodoListsSub) {
      this.userTodoListsSub.unsubscribe();
    }
  }

  getUser(): Observable<firebase.User> {
    return this.currentUser;
  }

  initAuthState(): void {
    this.currentUserSub = this.firebaseAuth.authState.subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  getAuthState() {
    return this.firebaseAuth.authState;
  }

  authLogin(email, password) {
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  authGoogleLogin() {
    this.firebaseAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  authAnonymousLogin() {
    this.firebaseAuth.auth.signInAnonymously();
  }

  authLogout() {
    this.firebaseAuth.auth.signOut();
  }

  authForgotPassword(email) {
    this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  createNewUser(email, password) {
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  getUserTodoLists(): Observable<TodoListModel[]> {
    return this.userTodoLists;
  }

  initUserTodoLists(userUID): void {
    const userTodoListsRef: AngularFirestoreCollection<TodoListModel> =
      this.af.collection('todoLists', todoList => todoList.where('userUID', '==', userUID));
    this.userTodoListsSub = userTodoListsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as TodoListModel;
        const docId = a.payload.doc.id;
        let itemsCompleted = 0;
        let itemsPending = 0;
        if (data.todos) {
          data.todos.map(item => {
            item.completed ? itemsCompleted++ : itemsPending++;
          });
        }
        return { docId, ...data, itemsCompleted, itemsPending };
      }))
    ).subscribe(userTodoLists => {
      this.userTodoListsSubject.next(userTodoLists);
    });
  }

/*
  getUserExerciseMatch(): Observable<UserExerciseMatchModel[]> {
    return this.userExerciseMatch;
  }

  initUserExerciseMatch(userExerciseDocId): void {
    const userExerciseMatchRef: AngularFirestoreCollection<UserExerciseMatchModel> =
      this.af.collection('userExerciseMatch/' + userExerciseDocId + '/userExercises');
    this.userExerciseMatchSub = userExerciseMatchRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as UserExerciseMatchModel;
        const docId = a.payload.doc.id;
        return {docId, ...data};
      }))
    ).subscribe(userExerciseMatchDetails => {
      this.userExerciseMatchSubject.next(userExerciseMatchDetails);
    });
  }

  getAdminMe(currentUID) {
    const allAdminsRef: AngularFirestoreCollection<SLAdmin> =
      this.af.collection('admins', admin => admin.where('uid', '==', currentUID));
    return allAdminsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as SLAdmin;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  getAllMyEvents(eventDocIdArray, eventType) {
    const allMyEventsRef: AngularFirestoreCollection<SLEvent> =
      this.af.collection(eventType + 'Events', evts => evts.orderBy('info.dateAndTime', 'desc'));
    return allMyEventsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as SLEvent;
        const id = a.payload.doc.id;
        if (eventDocIdArray.indexOf(id) > -1) {
          data.info.eventType = eventType;
          return {id, ...data};
        }
      }))
    );
  } */
}
