/* dependencies */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'hammerjs';

/* providers */

/* Material Design */
import { MaterialModule } from '@angular/material';

/* components */
import { AppComponent } from './app.component';
import { SigninFormComponent } from './signin-form/signin-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PingPongComponent } from './ping-pong/ping-pong.component';
import { DashboardComponent } from './dashboard/dashboard.component';

/* firebase */
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

/* routing */
import { AppRoutingModule } from './app-routing/app-routing.module';

const firebaseConfig = {
  apiKey: "AIzaSyBMhTKcsx1mBtRAASDy_YvoTNQk9yohItU",
  authDomain: "multigame-71efd.firebaseapp.com",
  databaseURL: "https://multigame-71efd.firebaseio.com",
  storageBucket: "multigame-71efd.appspot.com",
  messagingSenderId: "35095680642"
}

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    AppComponent,
    SigninFormComponent,
    SignupFormComponent,
    PageNotFoundComponent,
    PingPongComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
