#!/usr/bin/nodejs

// INITIALIZATION STUFF
var express = require('express');                     // import express
var app = express();                                  // create an app from express
var server =  require('http').createServer(app);      // import http and create a server
var io = require('socket.io').listen(server);         // attach socket.io to the server
var all_likes = require('./likes.js');

// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM
server.listen(process.env.PORT || 3000);              // listen for incoming connections

// -------------- variables  -------------- //
var game_state = {
    round: "",
    user_data: {},
    likes: []
}

var joined_users = {};

var unused_rounds = ["avatar", "twitter", "netflix", "amazon", "fb", "instagram"];

var game_started = false;

var current_id = 1;

var vote_start = false;

var vote_count = 0;

var tally = {};
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
        start_game(); // likes are retrieved here
        // var uuid = gen_uuid();
        var uuid = current_id;
        current_id++;
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

    socket.on('vote', function(obj){
        vote_count+=1
        if(!vote_start){
            for(var userid in Object.keys(game_state.user_data)){
            	console.log(userid);
                tally[""+userid] = 0;
            }
            vote_start = true;
        }
        vote(obj);
        console.log(tally);
        if(check_vote_finished()){
            console.log("finished");
            end_game();
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
    // if(Object.keys(joined_users).length < 7){
    //     finished = false;
    // }
	return finished

}

function round_finished(){
    set_round(game_state.round);
    // setTimeout(function(){
    //     io.emit('round_finished', game_state);
    // },15000); //delay 15 seconds 
    io.emit('round_finished', game_state); //to add delay, comment this line, uncomment above
}

function start_game(){
    if(!game_started){
        var len = unused_rounds.length;
        var index = Math.floor(Math.random()*len);
        var next_round = unused_rounds[index];
        unused_rounds.splice(index, 1);
        game_state.round = next_round;
        retrieve_likes();
        game_started = true;
        return next_round;
    }
}
function set_round(round){
    var len = unused_rounds.length;
    if(game_state.round == "vote"){
        game_state.round = "finished";
        return;
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

function retrieve_likes(){
	// up to 4 possible picks from each topic
	temp = new Set();
	var reps = Math.floor(Math.random()*2)+1;
	for(var topic in all_likes){
		console.log(topic);
		if(topic != 'Organizations' && topic != 'Restaurants'){
			for(var i=0; i<reps; i++){
				var len = all_likes[topic].length;
				var index = Math.floor(Math.random()*len);
				temp.add(all_likes[topic][index]);
			}
		}
		else{
			// the purpose of reps in the else statement is to decide whether to pass organizations/restaurants, which do not have a lot of examples
			if(reps < 2){
				var len = all_likes[topic].length;
				var index = Math.floor(Math.random()*len);
				temp.add(all_likes[topic][index]);
			}
		}
		
	} 
	game_state.likes = [...temp]; //remove duplicates
	console.log("likes: " + game_state.likes);
}
function vote(id){
    tally[id]+=1;
}
function check_vote_finished(){
    var size = Object.keys(game_state.user_data).length;
    var over = false;
    if(size == vote_count){
        over = true;
    }
    console.log("is voting finished? " + over);
    return over;
}

function end_game(){
	var max_key = "";
	var max = 0;
    for(var id in tally){
    	var total = tally[id];
    	if(total > max){
    		max = total;
    		max_key = id;
    	}
    }
    var spy = "0";
    console.log("length: " + Object.keys(joined_users).length);
    console.log("joined_users: " + joined_users.uuid.role);
    for (var uuid in Object.keys(joined_users)){
    	console.log("uuid: " +uuid);
    	if(uuid.role == "catfish"){
    		spy = uuid;
    		console.log("spy found");
       	}
    }
    var win = (max_key == spy); 
    console.log("max_key: " +max_key);
    console.log("max: " + max);
    console.log("spy: " + spy);
    console.log("winner: "+ win); 
    result = {"max_key": max_key, "max": max, "spy": spy, "win": win};
    io.emit('game_finished', result); //to add delay, comment this line, uncomment above
}