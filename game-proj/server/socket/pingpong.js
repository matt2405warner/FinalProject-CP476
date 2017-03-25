exports.init = function(io, socket) {
    /* send move up data to all sockets in room */
    socket.on('moveUp', (data) => {
        const room = this.manager.rooms["/" + data.gameId];

        /* check that the game room exists */
        if (room != undefined) {
            /* all clients need to have knowledge of the socket id */
            data.socketId = this.id;

            io.sockets.in(data.gameId).emit('clientMoveUp', data);
        } else {
            this.emit('error', {message: 'The game room does not exist.'});
        }
    });
    /* send move down data to all sockets in room */
    socket.on('moveDown', (data) => {
        const room = this.manager.rooms['/' + data.gameId];

        /* check that the game room exists */
        if (room != undefined) {
            /* all clients need to have knowledge of the socket id */
            data.socketId = this.id;

            io.sockets.in(data.gameId).emit('clientMoveDown', data);
        } else {
            this.emit('error', {message: 'The game room does not exist.'});
        }
    });
    /* send user scored */
    socket.on('scored', (data) => {
        const room = this.manager.rooms["/" + data.gameId];

        /* check if the game room exists */
        if ( room != undefined ) {
            /* all clients need to have knowledge of the socket id */
            data.socketId = this.id;

            io.sockets.in(data.gameId).emit('clientScored', data);
        } else {
            this.emit('error', {message: 'The game room does not exist.'});
        }
    });
    
    return socket;
}