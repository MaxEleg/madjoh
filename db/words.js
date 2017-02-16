var mongojs = require('mongojs');
var db = mongojs('mongodb://maj:123123@ds151909.mlab.com:51909/madjoh',['words']);
var words;

db.words.find().sort( { "difficulty": 1 } , 
	(function(err, res){
		if(err){
			console.log(err);
		}
		words = res;
	})
);

exports.words = db.words.find();