import { Component, OnInit } from '@angular/core';

import { AngularFire } from 'angularfire2';
import { User } from '../user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private af: AngularFire/*, private user: User*/) { 
  }

  ngOnInit() {
    this.af.auth.subscribe(auth => {
      /*this.user.email = auth.auth.email,
      this.user.displayName = auth.auth.displayName,
      this.user.emailVarified = auth.auth.emailVerified,
      this.user.uid = auth.auth.uid*/
    });
  }
}
