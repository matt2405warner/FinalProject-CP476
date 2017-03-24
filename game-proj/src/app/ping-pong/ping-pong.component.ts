import { Component, OnInit } from '@angular/core';

import { AngularFire } from 'angularfire2';

import { User } from '../user';

@Component({
  selector: 'app-ping-pong',
  templateUrl: './ping-pong.component.html',
  styleUrls: ['./ping-pong.component.css']
})
export class PingPongComponent implements OnInit {

  constructor(private af: AngularFire, private user: User) { }

  ngOnInit() {
    //this.af.auth.subscribe(auth => );
  }
}
