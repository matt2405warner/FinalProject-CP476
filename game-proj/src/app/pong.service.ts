import { Injectable, NgZone } from '@angular/core';

import { GameSocketService } from './game-socket.service';

import { GameBall } from './game-ball';
import { Paddle } from './paddle';
import { Player } from './player';
import { KeyCodes } from './keycode';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class PongService {
  private canvas: HTMLCanvasElement;
  private gameW = 600;
  private gameH = 400;
  private game2dContext: CanvasRenderingContext2D;

  private backgroundColor = "#eeeeee";

  private player1: Player;
  private player2: Player;
  private ball : GameBall;
  private running: boolean = false;

  private scoreToWin = 0;

  private roomSize = 2;
  private currentRoomSize = 0;

  private listenerKeys = {};

  private playerPadding = 10;
  private playerInitialW = 10;
  private playerInitialH = 60;
  private playerPaddleY = (this.gameH / 2) - (this.playerInitialH / 2);

  private gameData = new Subject();
  private gameEnd = new Subject();
  private player1Scored = new Subject();
  private player2Scored = new Subject();
  private gameId = 0;

  constructor(private gameSocket: GameSocketService, private ngZone: NgZone) { }

  initialize() {
    /* ---------------------------- 
    * Set Game UI
    */
    this.canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
    this.canvas.width = this.gameW;
    this.canvas.height = this.gameH;
    this.game2dContext = this.canvas.getContext('2d');
    
    
    /* -----------------------------
    * Set Game Pieces
    */
    
    //this.player1 = new Player(new Paddle(playerPadding, playerPaddleY, playerInitialW, playerInitialH, this.game2dContext));
    //this.player2 = new Player(new Paddle(this.gameW - playerPadding - playerInitialW, playerPaddleY, playerInitialW, playerInitialH, this.game2dContext));
    this.ball = new GameBall(this.gameW / 2, this.gameH / 2, this.game2dContext);
    this.ball.setRadius(5);

    /* ------------------------------
    * Game Service Setup
    */
    this.gameSocket.init("http://localhost:3232");
  }

  setupPlayers(localPlayerCount: number, networkPlayerCount: number, _scoreToWin: number) {
    this.currentRoomSize = localPlayerCount;
    if (localPlayerCount + networkPlayerCount == 2) {
      this.scoreToWin = _scoreToWin;
      if (localPlayerCount == 2) {
        this.setupPlayer1();
        this.setupPlayer2();
        this.startGame();
      } else {
        this.gameSocket.registerDisconnect().subscribe(data => {
          console.log("disconnect", data);
          this.currentRoomSize--;
          if (this.currentRoomSize < this.roomSize) {
            this.running = false;
          }
        });
        this.gameSocket.registerClientDisconnect().subscribe(data => {
          console.log("client disconnect", data);
          this.currentRoomSize--;
          if (this.currentRoomSize < this.roomSize) {
            this.running = false;
          }
        });
        this.gameSocket.registerCreateGame().subscribe((data: any) => {
          this.gameId = data.gameId;
          this.gameData.next(data); // propogate the new game data to all subscribers
        });
        this.gameSocket.registerJoinGame().subscribe((data: any) => {
          this.currentRoomSize++;
          if (this.currentRoomSize <= this.roomSize) {
            this.clientPlaying(data.senderId);
          } 
          if (this.currentRoomSize == this.roomSize) {
            var gameData = {
              gameId: this.gameId
            }
            this.gameSocket.emitStartGame(gameData);
            this.startGame();
          } else {
            var gameEmitData = {
              gameId: this.gameId
            }
            this.gameSocket.emitFullRoom(gameEmitData);
          }
        });
        this.gameSocket.registerMoveStartUp().subscribe((data: any) => {
          this.listenerKeys[KeyCodes.UP_ARROW] = true;
        });
        this.gameSocket.registerMoveStartDown().subscribe((data:any) => {
          this.listenerKeys[KeyCodes.DOWN_ARROW] = true;
        });
        this.gameSocket.registerMoveFinishUp().subscribe((data: any) => {
          delete this.listenerKeys[KeyCodes.UP_ARROW];
        });
        this.gameSocket.registerMoveFinishDown().subscribe((data: any) => {
          delete this.listenerKeys[KeyCodes.DOWN_ARROW];
        });
        this.gameSocket.emitCreateGame();
        if (localPlayerCount == 1) {
          this.setupPlayer1();
        }
      }
    }
  }

  gameLoop() {
    if (!this.running) { return; }
    else if (this.player1.isWinner(this.scoreToWin)) {
      let gameOverData = {
        gameId: this.gameId,
        winnerId: this.player1.id
      }
      this.gameSocket.emitEndGame(gameOverData);
      this.reset();
      var playerWon = "Player 1 won!";
      this.gameEnd.next(playerWon);
      return;
    } else if (this.player2.isWinner(this.scoreToWin)) {
      let gameOverData = {
        gameId: this.gameId,
        winnerId: this.player2.id
      }
      this.gameSocket.emitEndGame(gameOverData);
      this.reset();
      var playerWon = "Player 2 won!";
      this.gameEnd.next(playerWon);
      return;
    }
    this.update();
    this.render();
    /* this sits the game at 60FPS and game stops rendering when browser goes out of focus */
    window.requestAnimationFrame(() => this.gameLoop());
  }

  isRunning() {
    return this.running;
  }

  startGame() {
    this.running = true;
    this.gameLoop();
  }

  reset() {
    this.running = false;
    this.currentRoomSize = 0;
    this.player1 = null;
    this.player2 = null;
    this.scoreToWin = 0;
    this.currentRoomSize = 0;
  }

  update() {
    this.updatePlayers();
    let scored = this.ball.update(this.gameW, this.gameH, this.player1, this.player2);
    if (scored) {
      if (this.ball.getXPos() < this.gameW / 2) {
        this.player2.scored();
        this.player2Scored.next(this.player2.getScore());
        var score = {
          gameId: this.gameId,
          senderId: this.gameSocket.getSenderId(),
          player1: false,
          player1Score: this.player1.getScore(),
          player2: true,
          player2Score: this.player2.getScore()
        }
        this.gameSocket.emitScored(score);
      } else {
        this.player1.scored();
        this.player1Scored.next(this.player1.getScore());
        var score = {
          gameId: this.gameId,
          senderId: this.gameSocket.getSenderId(),
          player1: true,
          player1Score: this.player1.getScore(),
          player2: false,
          player2Score: this.player2.getScore()
        }
        this.gameSocket.emitScored(score);
      }
      this.ball.playerScored(this.gameW, this.gameH);
    }  
  }

  render() {
    this.game2dContext.fillStyle = this.backgroundColor;
    this.game2dContext.fillRect(0, 0, this.gameW, this.gameH);
    this.player1.render();
    this.player2.render();
    this.ball.render();
  }

  updatePlayers() {
    for (var keyValue in this.listenerKeys) {
      let value = Number(keyValue);
      if (value === KeyCodes.UP_ARROW) {
        this.player2.obj.moveUp();
      } else if (value === KeyCodes.DOWN_ARROW) {
        this.player2.obj.moveDown(this.gameH);
      } else if (value === KeyCodes.KEY_W) {
        this.player1.obj.moveUp();
      } else if (value === KeyCodes.KEY_S) {
        this.player1.obj.moveDown(this.gameH);
      }
    }
  }

  setupPlayer1() {
    this.player1 = new Player(new Paddle(this.playerPadding, this.playerPaddleY, this.playerInitialW, this.playerInitialH, this.game2dContext));
    this.player1.id = "local";
    window.addEventListener("keydown", (e) => {
      // NOTE: moving player must be done in update
      if (e.keyCode === KeyCodes.KEY_W || e.keyCode === KeyCodes.KEY_S) {
        this.listenerKeys[e.keyCode] = true; // placeholder value (any value can be used)
      }
    });
    // NOTE: player continues moving until key up. normally you would just use the addEventListener
    //  but all of this must be done in update()
    window.addEventListener("keyup", (e) => {
      if (e.keyCode === KeyCodes.KEY_W || e.keyCode === KeyCodes.KEY_S) {
        delete this.listenerKeys[e.keyCode];
      }
    });
}

  setupPlayer2() {
    this.player2 = new Player(new Paddle(this.gameW - this.playerPadding - this.playerInitialW, this.playerPaddleY, this.playerInitialW, this.playerInitialH, this.game2dContext));
    this.player2.id = "local";
    window.addEventListener("keydown", (e) => {
      // NOTE: moving player must be done in update
      if (e.keyCode === KeyCodes.UP_ARROW || e.keyCode === KeyCodes.DOWN_ARROW) {
        this.listenerKeys[e.keyCode] = true; // placeholder value (any value can be used)
      }
    });
    // NOTE: player continues moving until key up. normally you would just use the addEventListener
    //  but all of this must be done in update()
    window.addEventListener("keyup", (e) => {
      if (e.keyCode === KeyCodes.UP_ARROW || e.keyCode === KeyCodes.DOWN_ARROW) {
        delete this.listenerKeys[e.keyCode];
      }
    });
  }

  clientPlaying(_id: string) {
    console.log("player id:", _id);
    if (this.currentRoomSize == 1) {
      if (this.player1 == null) {
        this.player1 = new Player(new Paddle(this.playerPadding, this.playerPaddleY, this.playerInitialW, this.playerInitialH, this.game2dContext));
      }
      this.player1.id = _id;
    } else if (this.currentRoomSize == 2) {
      if (this.player2 == null) {
        this.player2 = new Player(new Paddle(this.gameW - this.playerPadding - this.playerInitialW, this.playerPaddleY, this.playerInitialW, this.playerInitialH, this.game2dContext));
      }
      this.player2.id = _id;
    }
  }

  get gameInfo() {
      return this.gameData.asObservable();
  }

  get endGame() {
    return this.gameEnd.asObservable();
  }

  get player1ScoreChange() {
    return this.player1Scored.asObservable();
  }

  get player2ScoreChange() {
    return this.player2Scored.asObservable();
  }
}
