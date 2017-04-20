var app = require('express')();
var http = require('http').Server(app);
var request = require('request');
var io = require('socket.io')(http,{origins: "http://localhost:5000"});
var API_URL = "https://wishginee.herokuapp.com/api/";

var users = [];

function updateUserList() {
    request.get({ url: API_URL+"sockets/"}, function (error, response, body) {
        if(response.statusCode == 200){
            return JSON.parse(body).data;
            // console.log(users);
        }
    });
}

io.on('connection', function (socket) {

    socket.on('join', function (data) {
        var formData = {
            'user_id' : data.user_id,
            'socket' : socket.id
        };
        console.log("joined");

        // Adding user to the connected list
        request.post({ url: API_URL+"sockets", json: true, body : formData }, function (error, response, body) {
           if(response.statusCode == 201){
               console.log("User Socket Added!");
           }
        });

        //Updating the list of users.
        users = updateUserList();
    });

    socket.on('update_notification', function (data) {
        var socketId = "";

        request.get({ url: API_URL+"sockets/"}, function (error, response, body) {
            if(response.statusCode == 200){
                users = JSON.parse(body).data;
                users.forEach(function (object, index, value) {
                    if(object.user_id === data.to_user_id){
                        socketId = object.socket;
                        if(io.sockets.connected[socketId]){
                            io.sockets.connected[socketId].emit('notification', data);
                        }
                    }
                });
            }
        });
    });
    
    socket.on('feed', function (data) {
        socket.broadcast.emit('feed_update', data);
    });

    socket.on('disconnect', function (socket) {
        console.log("User Disconnected!");
    });
});


http.listen(3000, function () {
    console.log("Started NodeJS Server....!")
});