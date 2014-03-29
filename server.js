 var express = require('express'),
     app = express(),
     http = require('http'),
     server = http.createServer(app),
     io = require('socket.io').listen(server),
     ent = require('ent'),
     fs = require('fs');


server.listen(8080, "0.0.0.0");

app.use(express.static(__dirname + '/www'));

io.sockets.on('connection', function(socket) {

	socket.on('say', function(edit) {
		console.log('SAY called.');

		socket.broadcast.emit('respond', edit);
	})

});
