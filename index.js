var http = require('http');
var path = require("path");
var bodyParser = require("body-parser");

var server = http.createServer(function(req, res) {
    fs.readFile('views/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var io = require('socket.io').listen(server);
var handler = require('./sock/handler.js');
var fs = require('fs');

var getWord = handler.getWord;
var sendPoints = handler.sendPoints;
var hideResponse = handler.hideResponse;


io.sockets.on('connection', function (socket) {

	console.log("Un client s'est connecté !");
	
	socket.emit("connect","CONNECTED");
	
	socket.points = 11;
	socket.enWord = "";
	socket.frWord = "";
	socket.attempt = 1;
	sendPoints(socket);
	
	socket.on('data', function (packet) {
		var data;
		switch(packet.header){
			
			case "getWord":
				if(socket.points > 0) //si on abandonne
					socket.points -= 1;
				getWord(socket);
			break;
			
			case "checkWord":
				if(packet.value == socket.enWord){ //si cest la bonne réponse
					socket.points += 1;
					socket.attempt = 10;
					data = {"type" : "success" , 
							"message" : "Proposition correcte ! Vous gagnez un point en plus ! "};
					
					socket.emit('alert', data);
					getWord(socket);
				}
				else if(socket.attempt == 1){ //si cetait la derniere tentative
					
					data = {"type" : "danger" , 
						    "message" : "Vous avez épuisé vos tentatives ! La réponse correcte était : " + socket.enWord};
					
					socket.emit('alert', data);
					
					if(socket.points > 0 )
						socket.points -= 1;
					
					getWord(socket);
				}
				else{ //sinon on baisse le nbr de tentative
					socket.attempt -= 1;
					data = {"type" : "warning" , 
							"message" : "Proposition incorrecte , " + socket.attempt + " tentatives restantes."};	
					socket.emit('alert', data);								  
				}
				sendPoints(socket);
			break;
			
		}
		
    });		
});


server.listen(9000);