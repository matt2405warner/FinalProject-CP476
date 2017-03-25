import { Component, OnInit } from '@angular/core';

import { AngularFire } from 'angularfire2';

import { Observable } from 'rxjs';

import { User } from '../user';

import * as io from 'socket.io-client';

@Component({
  selector: 'app-ping-pong',
  templateUrl: './ping-pong.component.html',
  styleUrls: ['./ping-pong.component.css']
})
export class PingPongComponent implements OnInit {
  gameSocket : any;

  constructor(private af: AngularFire) { }

  ngOnInit() {
    this.startGameConnection()
  }

  startGameConnection() {
    let roomSocket = io.connect();
    
    /* generate random number
      NOTE: slightly larger then 6 digits */
    let randomRoomNumber = Math.floor(Math.random() * 9999999);
    console.log("room number: ", randomRoomNumber);
    /* concatenat random room number and game url 
      NOTE: this allows for a significantly less 
        likely chance of collision */
    let room = "/game/pingpong/" + randomRoomNumber.toString();
    roomSocket.emi
  }
}
