var Utils = (function() {

	var xhr = function(o) {
		document.body.setAttribute('data-loading', '');
	
		var xhr = new XMLHttpRequest(),
			method = o.method || 'GET',
			data = o.data || '';
	
		xhr.open(method, o.url + (method === 'GET' && data? '?' + data : ''), true);
	
		if(method !== 'GET') {
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
	
		if(o.headers) {
			for(var header in o.headers) {
				xhr.setRequestHeader(header, o.headers[header]);
			}
		}
	
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4) {
				document.body.removeAttribute('data-loading');
				
				if(xhr.responseText) {
					o.callback(xhr);
				}
			}
		};
	
		xhr.send(method === 'GET'? null : data);

		return xhr;
	}

	return {
		xhr: xhr
	}

})();