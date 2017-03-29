import { Component, OnInit } from '@angular/core';

import { AngularFire } from 'angularfire2';

import { Observable } from 'rxjs';

import { GameSocketService } from '../game-socket.service';

import * as io from 'socket.io-client';
import { PongService } from '../pong.service';

@Component({
  selector: 'app-ping-pong',
  templateUrl: './ping-pong.component.html',
  styleUrls: ['./ping-pong.component.css'],
  providers: [ PongService ]
})
export class PingPongComponent implements OnInit {
  gameSocket : any;
  gameData: Object;

  constructor(private af: AngularFire, private pongService: PongService) { }

  ngOnInit() {
    this.pongService.initialize();
    this.pongService.setupPlayers(1, 1);
    //this.pongService.hostGame();

    
    /*this.gameService.init("http://localhost:3232");
    
    this.gameService.registerCreateGame().subscribe(data => {
      this.gameData = data;
      console.log(data);
    });
    this.gameService.emitCreateGame();

    this.gameService.registerJoinGame().subscribe((data: any) => {
      if (data.hostId === data.senderId) {
        console.log("ignore join", data);
      } else {
        console.log("accept join", data);
      }
    });
    
    this.gameService.registerMoveUp().subscribe((data: any) => {
      console.log("move up", data);
    });
    this.gameService.registerMoveDown().subscribe((data: any) => {
      console.log("move down", data);
    });*/
  }
}
