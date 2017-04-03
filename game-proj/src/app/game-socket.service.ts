import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class GameSocketService {

  constructor() { }

  socket: any;

  init(uri: string) {
      this.socket = io.connect(uri);
      console.log("game socket init");
  }

  getSenderId() {
      return this.socket.id;
  }

  registerConnect() {
      let observe = new Observable(observer => {
        this.socket.on('connect', data => {
            observer.next(data);
        });
      });
      return observe;
  }

  registerClientDisconnect() {
      let observe = new Observable(observer => {
        this.socket.on('clientDisconnected', data => {
            observer.next(data);
        });
      });
      return observe;
  }

  emitPlayerDisconnect(data: Object) {
      this.socket.emit('playerDisconnect', data);
  }

  registerDisconnect() {
      let observe = new Observable(observer => {
        this.socket.on('disconnect', data => {
            observer.next(data);
        });
      });
      return observe;
  }

  registerCreateGame() {
      let observe = new Observable(observer => {
          this.socket.on('clientGameCreated', (data) => {
              observer.next(data);
          });
      });

      return observe;
  }

  emitCreateGame() {
      this.socket.emit('createRoom');
  }

  registerJoinGame() {
      let observe = new Observable(observer => {
          this.socket.on('clientJoinedGame', (data) => {
              observer.next(data);
          });
      });
      return observe;
  }

  emitJoinGame(data: Object) {
      this.socket.emit('joinGame', data);
  }

  registerStartGame() {
      let observe = new Observable(observer => {
          this.socket.on('clientStartGame', (data) => {
              observer.next(data);
          });
      })
      return observe;
  }

  emitStartGame(data: Object) {
      this.socket.emit('startGame', data);
  }

  registerEndGame() {
      let observe = new Observable(observer => {
          this.socket.on('clientEndGame', (data) => {
              observer.next(data);
          });
      });
      return observe;
  }

  emitEndGame(data: Object) {
      console.log("end game");
      this.socket.emit('endGame', data);
  }

  registerMoveStartUp() {
      let observe = new Observable(observer => {
          this.socket.on('clientMoveStartUp', (data) => {
            observer.next(data);
          });
      });
      return observe;
  }

  emitMoveStartUp(data: Object) {
    this.socket.emit('moveStartUp', data);
  }

  registerMoveStartDown() {
      let observe = new Observable(observer => {
        this.socket.on('clientMoveStartDown', (data) => {
            observer.next(data);
        });
      });
      return observe;
  }

  emitMoveStartDown(data: Object) {
      this.socket.emit('moveStartDown', data);
  }

  registerMoveFinishUp() {
      let observe = new Observable(observer => {
        this.socket.on('clientMoveFinishUp', data => {
            observer.next(data);
        });
      });
      return observe;
  }

  registerMoveFinishDown() {
      let observe = new Observable(observer => {
        this.socket.on('clientMoveFinishDown', data => {
            observer.next(data);
        });
      });
      return observe;
  }

  emitScored(data: Object) {
      this.socket.emit('scored', data);
  }

  emitFullRoom(data: Object) {
      this.socket.emit('roomFull', data);
  }
}
