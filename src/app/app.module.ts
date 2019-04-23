import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, MatSnackBarModule, MatBottomSheetModule,
         MatToolbarModule, MatMenuModule, MatDialogModule, MatProgressSpinnerModule, MatCheckboxModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlatformModule } from '@angular/cdk/platform';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { TodoListsComponent } from './components/todo-lists/todo-lists.component';
import { TodosComponent } from './components/todos/todos.component';
import { WizardComponent } from './components/wizard/wizard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TodoListsComponent,
    TodosComponent,
    WizardComponent,
  ],
  entryComponents: [
    WizardComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    DragDropModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    PlatformModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatBottomSheetModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
