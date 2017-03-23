module.exports = function(server) {
    const io = require('socket.io')(server);
    io.on('connection', function(socket) {

    });
    const users = require('./user.js')(io);
    return io;
}