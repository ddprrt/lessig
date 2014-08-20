var Storage = (function() {

	var storage = undefined;
	
	var parse = function() {
		storage = JSON.parse(window.localStorage.getItem('lessig_settings'));
	};

	var get = function(key) {
		if(!storage) {
			parse();
		}
		if(storage && storage[key]) {
			return storage[key];
		}
	};

	var set = function(key, val) {
		if(!storage) {
			parse();
		}
		if(!storage) {
			storage = {};
		}
		storage[key] = val;
		window.localStorage.setItem('lessig_settings', JSON.stringify(storage));
	};

	window.addEventListener('storage', parse, true);

	return {
		get: get,
		set: set
	}
})();
