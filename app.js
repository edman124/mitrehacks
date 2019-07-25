#!/usr/bin/nodejs

// INITIALIZATION STUFF
var express = require('express');                     // import express
var app = express();                                  // create an app from express
var server =  require('http').createServer(app);      // import http and create a server
var io = require('socket.io').listen(server);         // attach socket.io to the server


// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM
server.listen(process.env.PORT || 8080);              // listen for incoming connections

// -------------- variables  -------------- //
var game_state = {
    user_data: {
        id: "",
        role: "",
        current_data: ""
    },
    game_data: {
        round: "",
        user_data: []
    }
}

var joined_users = [];


// -------------- express getter -------------- //
app.get('/', function (req, res, next) {
    res.sendFile(__dirname+'/index.html');
});

// -------------- socket initialization -------------- //
io.on('connection',function(socket){                  // called when a new socket connection is made

    console.log('new socket connection');
        
    socket.on('join_game', function(obj){            // server side socket callbacks for events
        console.log('client message!');
        
        // socket.emit('server_msg', button_count++); // server-side emit just to this client
        io.emit('server_msg', button_count++);        // server server-side emit to all clients
    })

})