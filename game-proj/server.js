const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const game = require('./server/socket/game.js');

//const routes = require('./server/routes');
const app = express();

// Used for POST data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Point to the apps static files (i.e. HTML, CSS, TS)
app.use(express.static(path.join(__dirname, 'dist')));

//app.use('/', routes);

// Catch all other routes and return the index files
// NOTE: let angular handle non-api calls
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = require('./server.config.js').port;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`APP running on localhost: ${port}`));

const io = require('./server/socket')(server);
io.sockets.on('connection', (socket) => {
    const gSocket = game.init(io, socket);
});