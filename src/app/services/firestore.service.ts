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
  private userDetailsSubject = new ReplaySubject<UserModel[]>();
  private userDetails: Observable<UserModel[]> = this.userDetailsSubject.asObservable();
  userDetailsSub: SubscriptionLike;
  private userTodoListsSubject = new ReplaySubject<TodoListModel[]>();
  private userTodoLists: Observable<TodoListModel[]> = this.userTodoListsSubject.asObservable();
  userTodoListsSub: SubscriptionLike;

  constructor(private af: AngularFirestore, public firebaseAuth: AngularFireAuth) {}

  ngOnDestroy(): void {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
    if (this.userDetailsSub) {
      this.userDetailsSub.unsubscribe();
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

  authLogin(email: string, password: string): void {
    this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  authGoogleLoginRegistration(): void {
    this.firebaseAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(userCredentials => {
        if (userCredentials.additionalUserInfo.isNewUser) {
          this.addNewUserToFirestore(userCredentials.user);
        } else {
          console.log('User logged in with Google!, userCredentials = ', userCredentials);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  authAnonymousLogin(): void {
    this.firebaseAuth.auth.signInAnonymously();
  }

  authLogout(): void {
    this.firebaseAuth.auth.signOut();
  }

  authForgotPassword(email: string): void {
    this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  createNewUser(email: string, password: string): void {
    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        this.addNewUserToFirestore(userCredentials.user);
      })
      .catch(error => {
        console.log(error);
      });
  }

  addNewUserToFirestore(user: firebase.User): void {
    console.log('In addNewUserToFirestore, user.uid = ', user.uid);
    let firstName = '';
    let lastName = '';
    if (user.displayName.length > 2 && user.displayName.indexOf(' ') > 0) {
      const splitUserName = user.displayName.split(' ');
      firstName = splitUserName[0];
      lastName = splitUserName[1];
    }
    const newUser: UserModel = {
      firstName,
      lastName,
      email: user.email,
      todoLists: [{ listName: 'My First List of Todos' }],
      userUID: user.uid,
    };
    const newUserRef: AngularFirestoreCollection<UserModel> = this.af.collection('users/');
    newUserRef.add(newUser).then(newUserObj => {
      console.log('In addNewUserToFirestore, newUserObj = ', newUserObj);
    });
  }

  getUserDetails(): Observable<UserModel[]> {
    return this.userDetails;
  }

  initUserDetails(userUID: string): void {
    const userDetailsRef: AngularFirestoreCollection<UserModel> =
      this.af.collection('users/', user => user.where('userUID', '==', userUID));
    this.userDetailsSub = userDetailsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
          const data = a.payload.doc.data() as UserModel;
          const userDocId = a.payload.doc.id;
          return { userDocId, ...data };
        }))
      ).subscribe(user => {
        this.userDetailsSubject.next(user);
    });
  }

  getUserTodoLists(): Observable<TodoListModel[]> {
    return this.userTodoLists;
  }

  initUserTodoLists(userDocId: string): void {
    const userTodoListsRef: AngularFirestoreCollection<TodoListModel> = this.af.collection('users/' + userDocId + '/todoLists');
    this.userTodoListsSub = userTodoListsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as TodoListModel;
        const todoListDocId = a.payload.doc.id;
        let itemsCompleted = 0;
        let itemsPending = 0;
        if (data.todos) {
          data.todos.map(item => {
            item.completed ? itemsCompleted++ : itemsPending++;
          });
        }
        return { todoListDocId, ...data, itemsCompleted, itemsPending };
      }))
    ).subscribe(userTodoLists => {
      this.userTodoListsSubject.next(userTodoLists);
    });
  }

  createNewTodoList(userDocId: string): void {
    const userTodoListsRef: AngularFirestoreCollection<TodoListModel> = this.af.collection('users/' + userDocId + '/todoLists');
    const newTodoList: TodoListModel = { listName: '', editingName: true };
    userTodoListsRef.add(newTodoList);
  }

  deleteTodoList(userDocId: string, todoListDocId: string): void {
    const userTodoListRef: AngularFirestoreDocument<TodoListModel> =
      this.af.doc('users/' + userDocId + '/todoLists/' + todoListDocId);
    userTodoListRef.delete();
  }

  updateTodoList(userDocId: string, todoListDocId: string, todoList: TodoListModel): void {
    const userTodoListRef: AngularFirestoreDocument<TodoListModel> =
      this.af.doc('users/' + userDocId + '/todoLists/' + todoListDocId);
    userTodoListRef.update(todoList);
  }

}
