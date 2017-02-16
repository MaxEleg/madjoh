var request = require('request');
var dataBase = require('../db/words.js');

var getWord;
var sendPoints;
var hideResponse;
var words;

cursor = dataBase.words;

cursor.sort( { "difficulty": 1 } , 
	(function(err, res){
		if(err){
			console.log(err);
		}
		words = res;
		console.log("Les mots ont bien été chargé le serveur est lancé !");
	})
);

getWord = function (socket){
	var rand = Math.floor(Math.random() * words.length);
				
				while(rand > words.length)
					rand = Math.floor(Math.random() * words.length);
				
				var word = words[rand];
				
				word.name = word.name.toString("utf8");
				
				socket.frWord = word.name;
				socket.attempt = 10;
								
				var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q="+word.name;
				
				request(url, function (error, response, body) {
					body = body.replace(",,,",',');
					body = body.replace(",,",',');
					if (!error && response.statusCode == 200) {
						const resJson = JSON.parse(body);
						socket.enWord = resJson[0][0][0].toLowerCase();
						console.log("Mot aléatoire choisi : "+ socket.frWord +" sa traduction : " + socket.enWord);
						
						data = { "frWord" : socket.frWord , "guess" : hideResponse(socket.enWord) };
						
						socket.emit('setWord' , data);

						data = {"type" : "success" , 
									  "message" : "Trouver la traduction du mot : " + socket.frWord};						
						}
						socket.emit('alert',data);						
						sendPoints(socket);
				})
				console.log("Un client a obtenu un nouveau mot");
}

sendPoints = function (socket){
	var dataPoints = { "value" : socket.points };
	
	if(socket.points == 20){
		var dataAlert = {"type" : "info" , 
				"message" : "Vous avez terminé le jeu !! Félicitation !! Vos points vont être réinitialiser à 10 !! "};
		socket.points = 10;
		socket.emit('alert',dataAlert);
	}
	else if(socket.points == 0){
		var dataAlert = {"type" : "danger" , 
				"message" : "Vous avez perdu le jeu !! Vos points vos être réinitialiser à 10 ! "};
		socket.points = 10;
		socket.emit('alert',dataAlert);
	}
	socket.emit('points',dataPoints);
}

hideResponse = function (enWord){
	var length = enWord.length;
	var firstLetter = enWord[0];
	var i = 0;
	var hide = firstLetter;
	
	while(i<length - 1)
	{
		hide += "*";
		i++;
	}
	
	return hide;
}

exports.getWord = getWord;
exports.sendPoints = sendPoints;
exports.hideResponse = hideResponse;