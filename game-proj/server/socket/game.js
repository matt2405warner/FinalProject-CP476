exports.init = function(io, socket) {
    /* create a new game (room) */
    socket.on('createRoom', () => {
        const gameId = Math.floor(Math.random() * 100000);
        console.log("game id: ", "4404");
        socket.emit('clientGameCreated', {gameId: 4404, hostId: socket.id, senderId: socket.id});

        //socket.join(gameId);
        socket.join(4404);
    });
    
    /* client attempt to join game */
    socket.on('joinGame', (data) => {
        console.log("join game");
        /* all clients need to have knowledge of the socket id */
        //data.socketId = this.id;

        /* join the game room */
        socket.join(data.gameId);

        /* inform all other connected clients of new player */
        io.to(data.gameId).emit('clientJoinedGame', data);
    });

    /* end game */
    socket.on('endGame', (data) => {
        console.log("end game");
        io.sockets.in(data.gameId).emit('clientEndGame', data);
    });

    /* start game */
    socket.on('startGame', (data) => {
        console.log("start game");
        io.sockets.in(data.gameId).emit('clientStartGame', data);
    });

    /* send move up on start data to all sockets in room */
    socket.on('moveStartUp', (data) => {
        console.log("move start up");
        io.sockets.in(data.gameId).emit('clientMoveStartUp', data);
    });

    /* send move up on finish data to all sockets in room */
    socket.on('moveFinishUp', (data) => {
        console.log("move finish up");
        io.sockets.in(data.gameId).emit('clientMoveFinishUp', data);
    });

    /* send move down data to all sockets in room */
    socket.on('moveStartDown', (data) => {
        console.log("move start down");
        io.sockets.in(data.gameId).emit('clientMoveStartDown', data);
    });

    /* send down finish data to all sockets in room */
    socket.on('moveFinishDown', (data) => {
        console.log("move finish down");
        io.sockets.in(data.gameId).emit('clientMoveFinishDown', data);
    });

    /* send user scored */
    socket.on('scored', (data) => {
        console.log("scored");
        io.sockets.in(data.gameId).emit('clientScored', data);
    });


    
    return socket;
}