/*
 * Voltrack Server
 * A server built with socket.io
 * 
 * To Run: 'node app.js'
 * To view control panel, open 'localhost:3000/' in a browser
 */ 

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Connect
io.on('connection', function(socket) {
    console.log(socket.id);
    
    // On Update
    socket.on('update', () => {
        console.log('update');
        io.emit('update');
    });

    // On Authorization
    socket.on('auth', () => {
        socket.emit('authorized');
        console.log('User Authorized');
    });
});
