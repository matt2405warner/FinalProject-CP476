exports.init = function(io, socket) {
    /* create a new game (room) */
    socket.on('createRoom', () => {
        const gameId = Math.floor(Math.random() * 100000);
        socket.emit('clientGameCreated', {gameId: gameId, hostId: socket.id, senderId: socket.id});

        socket.join(gameId);
        //socket.join(4404);
    });

    /* client attempt to join game */
    socket.on('joinGame', (data) => {
        /* join the game room */
        socket.join(data.gameId);
        socket.emit("yourSocketId", {socketId: socket.id});

        /* inform all other connected clients of new player */
        io.to(data.gameId).emit('clientJoinedGame', {senderId: socket.id, gameId: data.gameId});
    });

    /* player disconnect */
    socket.on('playerDisconnect', data => {
        io.sockets.in(data.gameId).emit('clientDisconnected', data);
    });

    /* end game */
    socket.on('endGame', (data) => {
        io.sockets.in(data.gameId).emit('clientEndGame', data);
    });

    /* start game */
    socket.on('startGame', (data) => {
        io.sockets.in(data.gameId).emit('clientStartGame', data);
    });

    /* send move up on start data to all sockets in room */
    socket.on('moveStartUp', (data) => {
        io.sockets.in(data.gameId).emit('clientMoveStartUp', data);
    });

    /* send move up on finish data to all sockets in room */
    socket.on('moveFinishUp', (data) => {
        io.sockets.in(data.gameId).emit('clientMoveFinishUp', data);
    });

    /* send move down data to all sockets in room */
    socket.on('moveStartDown', (data) => {
        io.sockets.in(data.gameId).emit('clientMoveStartDown', data);
    });

    /* send down finish data to all sockets in room */
    socket.on('moveFinishDown', (data) => {
        io.sockets.in(data.gameId).emit('clientMoveFinishDown', data);
    });

    /* send user scored */
    socket.on('scored', (data) => {
        io.sockets.in(data.gameId).emit('clientScored', data);
    });


    
    return socket;
}