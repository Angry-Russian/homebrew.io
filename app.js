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

app.use(sessions({
	cookieName: 'homebrew-session',
	secret: config.session.secret,
	duration: config.session.duration,
	activeDuration: config.session.activeDuration,
}));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/static/index.html');
});

app.post('/register', function(req, res){
	// TODO: capcha and whatnot
});

app.post('/login', function(req, res){
	var query = {email:req.body.user};

	db.collection('users').findOne(query, function(err, user){
		if(err)
			res.status(400).send(err);
		else if(user.password == hash(req.body.password))
			res.status(200).send(_.omit(user, 'password'));
		else
			res.status(400).send({error: 'invalid credentials'})
	});
});

app.get('/me', function(req, res){
	// TODO: Current session's user info
	// TODO: if not logged in redirect to login
});
app.get('/me/posts', function(req, res){
	// TODO: Current user's creations
});

app.get('/:collection(user|post)/:id', function(req, res){
	// get user/post by id
	var collection = {
		user:'users',
		post:'posts'
	}[req.params.collection];

	if(!collection)
		return res.status(400).send({error:400})

	var query = {slug:req.params.id};
	if(/^[a-zA-Z0-9]{24}$/.test(req.params.id))
		query = {_id:ObjectId(req.params.id)};

	db.collection(collection).findOne(query, function(err, entity){
		if(err)
			res.status(400).send(err);
		else if(entity)
			res.status(200).send(_.omit(entity, ['password', 'preferences'].concat(user.preferences.hiddenInfo)))
		else
			res.status(404).send({error:404});
	});
});

app.get('/posts/:id([a-zA-Z0-9]{24})/related', function(req, res){
	var query = {parent:req.params.id};
	db.collection('posts').find(query, function(err, posts){
		if(err)
			res.status(500).send(err);
		else
			res.status(200).send(posts);
	})
});

app.get('/tags', function(req, res){
	// TODO: get all tags
	/*db.collection('posts').aggregate([
		{ "$project": { "hashtags":1 }},  
		{ "$unwind": "$hashtags" },  
		{ "$group": { "_id": "$hashtags", "count": { "$sum": 1 } }}  
	])//*/
	// from : http://stackoverflow.com/questions/22926040/count-tags-in-tag-array-in-a-mongodb-document-inside-a-collection
});

app.get('/tags/:filter([a-zA-Z0-9\-\_\.\+\,]+)', function(req, res){
	// TODO: get filtered tags
});

app.get('/tagged/:search([a-zA-Z0-9\-\_\.\+\,]+)', function(req, res){
	var tags = req.params.search.split(','),
		match = [],
		unmatch = [],
		pre = '^', post = '$'
	for(var tag of tags){
		var target;
		
		if(tag.startsWith('-')){
			tag = tag.substring(1);
			target = unmatch;
		} else
			target = match;

		if(tag.startsWith("*")){
			tag = tag.substring(1);
			pre = '';
		}

		if(tag.endsWith("*")){
			tag = tag.substring(0, tag.length-1);
			post = '';
		}

		tag = tag.replace(/\*/gi, '(.+)');
		target.push(new RegExp(pre + tag + post));
	}

	db.collection('posts').find({
		$and:[
			{tags : {$in:match}},
			{tags : {$nin:unmatch}}
		]
	}, function(err, posts){
		if(err)
			res.status(400).send(err);
		else
			res.status(200).send(posts);
	})
	// TODO: build "and" and "not" structure from tags
});

app.use(express.static(__dirname + '/static'));

app.use(function(req, res, next){
	res.status(404).send("404 - Not found");
});

var server =  app.listen(config.port, function(){
	
	var os = require('os');
	var ifaces = os.networkInterfaces();

	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0;

		ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return;
			}

			if (alias >= 1) {
				// this single interface has multiple ipv4 addresses
				console.log(ifname + ':' + alias, iface.address);
			} else {
				// this interface has only one ipv4 adress
				console.log(ifname, iface.address);
			}
			++alias;
		});
	});
	
	console.log('Server', server.address().address, 'Listening on port', server.address().port);
});
