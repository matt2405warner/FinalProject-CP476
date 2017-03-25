exports.init = function(io, socket) {
    /* create a new game (room) */
    socket.on('createRoom', () => {
        const gameId = Math.random() * 100000;
        this.emit('newGameCreated', {gameId: gameId, socketId: this.id});

        this.join(gameId);
    });
    
    /* client attempt to join game */
    socket.on('joinGame', (data) => {
        const room = this.manager.rooms["/" + data.gameId];

        /* check that the game room exists */
        if ( room != undefined ) {
            /* all clients need to have knowledge of the socket id */
            data.socketId = this.id;

            /* join the game room */
            this.join(data.gameId);

            /* inform all other connected clients of new player */
            io.sockets.in(data.gameId).emit('clientJoinedRoom', data);
        } else {
            this.emit('error', {message: 'The game room does not exist.'});
        }
    });

    /* end game */
    socket.on('endGame', (data) => {
        const room = this.manager.rooms["/" + data.gameId];

        /* check that the game room exists */
        if (room != undefined) {
            /* all clients need to have knowledge of the socket id */
            data.socketId = this.id;

            io.sockets.in(data.gameId).emit('clientEndGame', data);
        } else {
            this.emit('error', {message: 'The game room does not exist.'});
        }
    });

    /* start game */
    socket.on('startGame', (data) => {
        const room = this.manager.rooms["/" + data.gameId];

        /* check that the game room exists */
        if ( room != undefined ) {
            /* all clients need to have knowledge of the socket id */
            data.socketId = this.id;

            io.sockets.in(data.gameId).emit('clientStartGame', data);
        } else {
            this.emit('error', {message: 'The game room does not exist.'});
        }
    });
    return socket;
}