var App = (function() {

	var lss = CodeMirror(document.getElementById('less'), {
		mode: "text/x-less",
		theme: "monokai",
		tabSize: 2,
		indentWithTabs: false,
		//lineNumbers: true
	});



	var css = CodeMirror(document.getElementById('css'), {
		mode: "text/css",
		theme: "monokai",
		tabSize: 2,
		indentWithTabs: false,
		readOnly: true
		//lineNumbers: true
	});

	var parse = function() {
		less.render(lss.doc.getValue())
			.then(function(output) {
				css.setValue(output.css)	
			}, function(err) {
				css.setValue(err.message);
			});
	}

	var dirty = ko.observable(false);

	lss.on('change', function() {
		parse();
		dirty(true);
		Storage.set('less', lss.getValue());
	});


	if(Storage.get('less')) {
		lss.setValue(Storage.get('less'));
		parse();
	}

	return {
		setLess: function(code) {
			lss.setValue(code);
		},
		getLess: function() {
			return lss.getValue();
		},
		clear: function() {
			lss.setValue('');
			dirty(false);
		},
		dirty: dirty
	}

})();
