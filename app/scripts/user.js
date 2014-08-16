var User = (function() {
	var clientID = '260338b1bcaea7c0fcef';

	// Got an auth
	var uri = window.location.href;
	
	if(uri.indexOf('?code=')) {
		window.localStorage.setItem('lessig_token', uri.substr(uri.indexOf('?code=') + 6));
		window.close();
	}

	var gist = {
		auth: function() {
			window.open('https://github.com/login/oauth/authorize'
				+ '?client_id=' + clientID + '&scope=gist,user&redirect_uri=' + window.location.href);
		},

		request: function(o) {
			var ACCESS_TOKEN = window.localStorage.getItem('lessig_token')
			o.method = o.method || 'GET';
			o.id = o.id || '';
			o.rev = o.rev || '';
			o.accepted = o.accepted || [];
		
			var anon = o.anon || o.method === 'GET';
		
			if(!anon && !ACCESS_TOKEN) {
				gist.oauth[0](function(){
					gist.request(o);
				});
				return;
			}
		
			var path = o.path || 'gists' +
					(o.id? '/' + o.id : '') +
					(o.rev? '/' + o.rev : '') +
					(o.gpath || '');
				
			Utils.xhr({
				method: o.method,
				url: 'https://api.github.com/' + path + (!o.anon && ACCESS_TOKEN? '?access_token=' + ACCESS_TOKEN : ''),
				headers: o.headers,
				callback: function(xhr) {				
					var data = xhr.responseText? JSON.parse(xhr.responseText) : null;
					
					if (data && data.message && o.accepted.indexOf(xhr.status) === -1) {
						alert('Sorry, I got a ' + xhr.status + ' (' + data.message + ')');
					}
					else {
						o.callback && o.callback(data, xhr);
					}
				},
				data: o.data? JSON.stringify(o.data) : null
			});
		},
		getUser: function(callback) {
			gist.request({
				path: 'user',
				callback: function(data) {
					console.log(data)
				}
			});
		}
	}

	window.onstorage = function() {
		if(window.localStorage.getItem('lessig_token')) {
			alert("LOGGED IN!");
		}
	}

	return {
		auth: gist.auth,
		user: gist.getUser
	}
})();
