var config = require('./config.js');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var MongoDB = require('mongodb');
var mongo = MongoDB.MongoClient;
var ObjectId = MongoDB.ObjectID;
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var sessions = require('client-sessions');
var _ = require('underscore');

var db = null;

mongo.connect(config.db.uri, function(err, database){
	if(!err) db = database;
	else {
		console.log('[ERROR]:', err, "\n\nExiting.");
		process.exit();
	}
});

app.use(function DatabaseChecker(req, res, next){
	if(!db){
		res.status(500).send("Error 500. No database connection.");
	}else next();
})

app.get('/', function(req, res){
	res.sendFile(__dirname + '/static/index.html');
});


app.get('/register', function(req, res){

});


app.post('/register', function(req, res){

});


app.get('/login', function(req, res){
});


app.post('/login', function(req, res){});

app.get('/user/:id', function(req, res){
	console.log(req.params);
	db.collection('users').findOne({_id:ObjectId(parseInt(req.params.id))}, function(err, user){
		if(!err && user){
			res.status(200).send(_.omit(user, ['password', 'preferences'].concat(user.preferences.hiddenInfo)))
		}else res.status(404).send({error:404});
		console.log(err, user);
	});
});
app.get('/user/items', function(req, res){});
app.get('/user/stories', function(req, res){});
app.get('/user/characters', function(req, res){});

app.get('/tags', function(req, res){});
app.get('/tag/:tag', function(req, res){});

app.get('/items', function(req, res){});
app.get('/item/:id', function(req, res){});
app.put('/item/:id', function(req, res){});
app.post('/item/:id', function(req, res){});
app.delete('/item/:id', function(req, res){});

app.get('/stories', function(req, res){});
app.get('/story/:id', function(req, res){});
app.put('/story/:id', function(req, res){});
app.post('/story/:id', function(req, res){});
app.delete('/story/:id', function(req, res){});

app.get('/characters', function(req, res){});
app.get('/character/:id', function(req, res){});
app.put('/character/:id', function(req, res){});
app.post('/character/:id', function(req, res){});
app.delete('/character/:id', function(req, res){});


app.use(express.static(__dirname + '/static'));

app.use(function(req, res, next){
	res.status(404).send("404 - Not found");
});

http.listen(config.port, function(){
	console.log('Listening on port', config.port);
});