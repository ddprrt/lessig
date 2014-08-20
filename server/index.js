'use strict';

var express = require('express'),
	path	= require('path'),
	request = require('request-promise'),
	keys	= require('./keys');

var server = express();
var url = path.resolve(__dirname, '../dist');

console.log("Serving: " + url);

server.use(express.static(url));

server.get('/gist/:id', function(req, res) {
	res.sendFile(path.resolve(url, 'index.html'));
});

server.get('/auth', function(req, res) {
	if(typeof req.query.code !== 'undefined') {
		request({
			uri: 'https://github.com/login/oauth/access_token',
			method: 'POST', 
			form: {
				client_id: 		keys.id,
				client_secret: 	keys.secret,
				code:			req.query.code
			}
		}).then(function(result) {
			if(result.indexOf('access_token=') >= 0) {
				var parts = result.split('&');
				var token = parts[0].split('=')[1];
				var code = "<!doctype html><body><script>" + 
					"window.localStorage.setItem('lessig_token', '" + token + "');\n" + 
					"window.location.href = window.location.href.replace('/auth','/');" +
					"</script></body>";
				res.send(code);
			} else {
				res.send("error authenticating");	
			}
		}).catch(function(error) {
			res.send(error.response.body);
		});
	}
});

server.listen(3000);
