'use strict';

var express = require('express'),
	path	= require('path'),
	keys	= require('./keys');

var server = express();
var url = path.resolve(__dirname, '../dist');

console.log(url);

server.use(express.static(url));

server.get('/gist/:id', function(req, res) {
	res.sendFile(path.resolve(url, 'index.html'));
});

server.get('/auth', function(req, res) {
	res.send('Todo...');
});

server.listen(3000);
