import { Injectable, NgZone } from '@angular/core';

import { GameSocketService } from './game-socket.service';

import { GameBall } from './game-ball';
import { Paddle } from './paddle';
import { Player } from './player';
import { KeyCodes } from './keycode';

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

  private roomSize = 2;
  private currentRoomSize = 0;

  private listenerKeys = {};

  private playerPadding = 10;
  private playerInitialW = 10;
  private playerInitialH = 60;
  private playerPaddleY = (this.gameH / 2) - (this.playerInitialH / 2);

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
    this.running = true;

    /* ------------------------------
    * Game Service Setup
    */
    this.gameSocket.init("http://localhost:3232");
  }

  setupPlayers(localPlayerCount: number, networkPlayerCount: number) {
    this.currentRoomSize = localPlayerCount;
    if (localPlayerCount + networkPlayerCount == 2) {
      if (localPlayerCount == 2) {
        this.setupPlayer1(true);
        this.setupPlayer2(true);
        this.gameLoop();
      } else {
        this.gameSocket.registerDisconnect().subscribe(data => {
          console.log("disconnect", data);
        });
        this.gameSocket.registerCreateGame().subscribe(data => {
          this.gameSocket.setGameData(data);
          console.log("register game", data);
        });
        this.gameSocket.registerJoinGame().subscribe((data: any) => {
          console.log("player joined game", data);
          this.currentRoomSize++;
          if (this.currentRoomSize <= this.roomSize) {
            this.clientPlaying(data.senderId);
          } 
          if (this.currentRoomSize == this.roomSize) {
            //this.gameSocket.emitStartGame();
            this.ngZone.runOutsideAngular(() => {this.gameLoop();});
          } else {
            // TODO: emit game room full
          }
        });
        this.gameSocket.registerMoveStartUp().subscribe((data: any) => {
          console.log("move start up data", data);
          this.listenerKeys[KeyCodes.UP_ARROW] = true;
        });
        this.gameSocket.registerMoveStartDown().subscribe((data:any) => {
          console.log("move start down data", data);
          this.listenerKeys[KeyCodes.DOWN_ARROW] = true;
        });
        this.gameSocket.registerMoveFinishUp().subscribe((data: any) => {
          console.log("move finish up data", data);
          delete this.listenerKeys[KeyCodes.UP_ARROW];
        });
        this.gameSocket.registerMoveFinishDown().subscribe((data: any) => {
          console.log("move finish down data", data);
          delete this.listenerKeys[KeyCodes.DOWN_ARROW];
        });
        this.gameSocket.emitCreateGame();
        if (localPlayerCount == 1) {
          console.log("local player joined");
          this.setupPlayer1(true);
        }
      }
    }
  }

  gameLoop() {
    if (!this.running) { return; }
    this.update();
    this.render();
    /* this sits the game at 60FPS and game stops rendering when browser goes out of focus */
    window.requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    this.updatePlayers();
    let scored = this.ball.update(this.gameW, this.gameH, this.player1, this.player2);
    if (scored) {
      if (this.ball.getYPos() < this.gameW / 2) {
        console.log("player 2 scored!");
      } else {
        console.log("player 1 scored!");
      }
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

  setupPlayer1(isLocal: boolean) {
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

  setupPlayer2(isLocal: boolean) {
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
    if (this.currentRoomSize == 1) {
      this.player1 = new Player(new Paddle(this.playerPadding, this.playerPaddleY, this.playerInitialW, this.playerInitialH, this.game2dContext));
      this.player1.id = _id;
    } else if (this.currentRoomSize == 2) {
      this.player2 = new Player(new Paddle(this.gameW - this.playerPadding - this.playerInitialW, this.playerPaddleY, this.playerInitialW, this.playerInitialH, this.game2dContext));
      this.player2.id = _id;
    }
  }
}
