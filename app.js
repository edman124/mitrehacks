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

var unused_rounds = ["avatar", "twitter", "netflix", "amazon", "fb", "instagram"];

var game_started = false;

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
        console.log("Game Started");
        start_game();
        var uuid = gen_uuid();
        joined_users.uuid = 
            {id: uuid, 
            role: gen_status()
            //current_data: {avatar: "", twitter: "", netflix: "", awl: "", fb: "", figa: ""}
        };
        //game_state.user_data.push(joined_users.uuid);
        game_state["user_data"][uuid] = {};
        console.log("Init Game State",game_state);
        //socket.emit('server_msg', joined_users.uuid); // server-side emit just to this client
        
        // push both the game_stat and uuid on server start 
        var result = {gs: game_state, user: joined_users.uuid};
        socket.emit('game_started', result);        // server server-side emit to all clients
    })

    socket.on('move', function(obj){
        //object is {id: _, round: _, answer: _}
        console.log("move input obj",obj);
        game_state["user_data"][obj.id][obj.round] = obj.answer
        console.log("post move game state", game_state);
        console.log("check round finished", check_round_finished(game_state.round))
        if(check_round_finished(game_state.round)){
            round_finished();
        }

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

function check_round_finished(round){
	var finished = true;
	for (var userid in game_state.user_data){
		if(!game_state.user_data[userid].hasOwnProperty(round)){
			finished = false;
		}
	}
	return finished

}

function round_finished(){
    set_round(game_state.round);
    io.emit('round_finished', game_state);
}

function start_game(){
    if(!game_started){
        var len = unused_rounds.length;
        var index = Math.floor(Math.random()*len);
        var next_round = unused_rounds[index];
        unused_rounds.splice(index, 1);
        game_state.round = next_round;
        game_started = true;
        return next_round;
    }
}
function set_round(round){
    var len = unused_rounds.length;
    if(game_state.round == "vote"){
        
    }
    if(len == 0){
        game_state.round = "vote";
        return;
    }
    var index = Math.floor(Math.random()*len);
    var next_round = unused_rounds[index];
    console.log(unused_rounds);
    unused_rounds.splice(index, 1);
    console.log(unused_rounds);
    game_state.round = next_round;
    return next_round;
}
