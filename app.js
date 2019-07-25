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
    round: "",
    user_data: {}
}

var joined_users = {};

//avatar, twitter handle, day of time of netflix, whats on amazon wishlist, fb status, followed instagram account

// -------------- express getter -------------- //
app.get('/', function (req, res, next) {
    res.sendFile(__dirname+'/index.html');
});

// -------------- socket initialization -------------- //
io.on('connection',function(socket){                  // called when a new socket connection is made

    console.log('new socket connection');
        
    socket.on('join_game', function(obj){            // server side socket callbacks for events
        console.log('client message!');
        var uuid = gen_uuid();
        joined_users.uuid = 
            {id: uuid, 
            role: gen_status()
            //current_data: {avatar: "", twitter: "", netflix: "", awl: "", fb: "", figa: ""}
        };
        //game_state.user_data.push(joined_users.uuid);
        game_state["user_data"][uuid] = {};
        console.log("Init Game State",game_state);
        socket.emit('server_msg', joined_users.uuid); // server-side emit just to this client

        
        //io.emit('server_msg', button_count++);        // server server-side emit to all clients
    })

    socket.on('move', function(obj){
        //object is {id: _, round: _, answer: _}
        console.log("move input obj",obj);
        game_state["user_data"][obj.id][obj.round] = obj.answer
        console.log("post move game state", game_state);

    })

})

function gen_status(){
    var status = "villager";
    if(Object.keys(joined_users).length === 0){
        status = "catfish";
    }
    return status;
}

function gen_uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function check_round(){
}
