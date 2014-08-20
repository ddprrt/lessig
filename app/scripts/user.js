var User = (function() {
	var clientID = '260338b1bcaea7c0fcef';

	var gist = {
		auth: function() {
			window.location.href = 'https://github.com/login/oauth/authorize' + '?client_id=' + clientID + '&scope=gist,user';
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
				callback: callback
			});
		},
		getGists: function(callback) {
			gist.request({
				path: 'gists',
				callback: callback
			})
		},
		getGist: function(gistid, callback) {
			gist.request({
				path: 'gists/' + gistid,
				callback: callback
			})
		},
		saveGist: function(data, callback) {
			gist.request({
				path: 'gists',
				method: 'POST',
				data: data,
				callback: callback
			})
		}
	};

	var save = function() {
		var data = {
			"description": "A Lessig File",
			"public": true,
			"files": {
				"lessig.less": {
					"content": App.getLess()
				}
			}
		};
		gist.saveGist(data, function(res) {
			if(res && res.id && window.history) {
				window.history.pushState(res, "gist " + res.id, window.location.href.split('?')[0] + 'gist/' + res.id);
			}
		});
	}

	var checkLogin = function() {
		return window.localStorage.getItem('lessig_token') != null;
	};

	var checkData = function() {
		if(window.location.href.indexOf('/gist/') > 0) {
			var parts = window.location.href.split('/');
			var gistId = parts[parts.length - 1];

			gist.getGist(gistId, function(data) {
				if(data && data.files && data.files["lessig.less"]) {
					App.setLess(data.files["lessig.less"].content);
				} else {
					App.setLess("Not a valid lessig gist");
				}
			});
		}
	};

	// Constructor
	(function() {
		window.addEventListener('storage', checkLogin, true);
		checkLogin();
		checkData();
	})();

	
	return {
		auth: 		gist.auth,
		user: 		gist.getUser,
		gists: 		gist.getGists,
		gist: 		gist.getGist,
		save: 		save,
		loggedin: 	ko.observable(checkLogin()),
		loggedout: 	ko.observable(!checkLogin()),
		logout: function() {
			window.localStorage.removeItem('lessig_token');
			this.loggedin(checkLogin());
			this.loggedout(!checkLogin());
		},
		login: function() {
			gist.auth();	
		}
	}
})();

ko.applyBindings(User);
