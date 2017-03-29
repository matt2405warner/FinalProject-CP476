import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* components */
import { SigninFormComponent } from '../signin-form/signin-form.component';
import { SignupFormComponent } from '../signup-form/signup-form.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { PingPongComponent } from '../ping-pong/ping-pong.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

/* application routes */
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'signin',
    component: SigninFormComponent
  },
  {
    path: 'signup',
    component: SignupFormComponent
  },
  {
    path: 'game/pingpong',
    component: PingPongComponent,
    data: {
      host: false
    }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
