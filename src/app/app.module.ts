import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule,
         MatToolbarModule, MatCheckboxModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
// import { reducers, metaReducers } from './reducers';
import { LoginComponent } from './components/login/login.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TodoListComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers),
    // StoreModule.forRoot(reducers, { metaReducers }),
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
