import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFire } from 'angularfire2';

import { Observable } from 'rxjs';

import { GameSocketService } from '../game-socket.service';
import { PongService } from '../pong.service';

import * as io from 'socket.io-client';


@Component({
  selector: 'app-ping-pong',
  templateUrl: './ping-pong.component.html',
  styleUrls: ['./ping-pong.component.css'],
  providers: [ PongService ]
})
export class PingPongComponent implements OnInit {
  gameData: any;
  pongInfoForm: FormGroup;

  formErrors = {
    'localPlayerCount': '',
    'networkPlayerCount': '',
    'scoreToWin': '',
  }

  validationMessages = {
    'localPlayerCount': {
      'requried': 'Local Players Count is required.',
      'pattern': 'Local Players Count must be in numerical format.',
    },
    'networkPlayerCount': {
      'required': 'Network Players Count is required.',
      'pattern': 'Network Players Count must be in numberical format.' 
    },
    'scoreToWin': {
      'required': 'Score To Win is required.',
      'pattern': 'Score To Win must be in numberical format.'
    }
  }

  constructor(private af: AngularFire, private pongService: PongService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.af.auth.subscribe(user => {
      if (user == null) {
        this.router.navigate(['/signin']);
      }
    });

    this.pongInfoForm = this.fb.group({
      'localPlayerCount': ['', [
          Validators.required,
          Validators.pattern(`^[0-9]$`)
        ]
      ],
      'networkPlayerCount': ['', [
          Validators.required,
          Validators.pattern(`^[0-9]$`)
        ]
      ],
      'scoreToWin': ['', [
          Validators.required,
          Validators.pattern(`^[0-9]$`)
        ]
      ]
    });

    this.pongService.initialize();
    
    this.pongService.gameInfo.subscribe(data => {
      this.gameData = data;
      document.getElementById("gameRoomId").innerHTML = this.gameData.gameId;
      console.log("game info", data);
    });

    this.pongService.player1ScoreChange.subscribe((score: any) => {
      document.getElementById("player1Score").innerHTML = score;
    });

    this.pongService.player2ScoreChange.subscribe((score: any) => {
      document.getElementById("player2Score").innerHTML = score;
    });

    this.pongService.endGame.subscribe(data => {
      console.log("game ended: ", data);
      this.resetPage(data);
    });
  }

  resetPage(message: any) {
    this.pongInfoForm.reset();
    document.getElementById("gameRoomId").innerHTML = "";
    document.getElementById("player1Score").innerHTML = "0";
    document.getElementById("player2Score").innerHTML = "0";
    alert("Game Is Over! " + message);
  }

  startGame() {
    this.pongService.setupPlayers(+this.pongInfoForm.value.localPlayerCount, +this.pongInfoForm.value.networkPlayerCount, +this.pongInfoForm.value.scoreToWin);
  }

  logout() {
    this.af.auth.logout();
  }
}
