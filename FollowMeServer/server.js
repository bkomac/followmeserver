var port = 4000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sessions = [];
var numOnlineUsers;

console.log('Starting node on port ' + port + '...');

app.get('/', function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	console.log("GET request...");
	res.end('This is socket.io endpoint on port ' + port + ' \n');
});

io.on('connection', function(socket) {
	var address = socket.handshake.address;
	console.log("*** Conecting ... #" + socket.id + " " + socket.request.connection.remoteAddress);

	socket.on('put_position', function(msg) {
		// console.log(JSON.stringify(socket));
		var pos = JSON.parse(msg);

		msg.socketId = socket.id;

		sessions.push(new User().setUser(msg.uddi, msg.socketId, msg.user));

		console.log("user: " + pos.user + ":. #" + socket.id + "  " + pos.lat + " " + pos.lng);
		io.emit('get_position', msg);
	});
});

io.on('disconnect', function(socket) {
	console.log('*** disconnected socket #' + socket.id);
});

http.listen(port, function() {
	console.log('listening on:' + port + ' ...');
});

setInterval(function() {
	for ( var user in sessions) {
		if (user.tst < new Date().getTime() - 10 * 1000) {
			console.log("Remove user..." + user.userName);
			user = null;
		}

	}
}, 10 * 1000);

function User() {
	this.id;
	this.socketId;
	this.userName;
	this.tst;

	this.setUser = function(id, socketId, userName) {
		console.log("Adding user... " + userName);
		this.id = id;
		this.socketId = socketId;
		this.userName = userName;
		this.tst = new Date().getTime();
		numOnlineUsers++;
	};

	

}
