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

	var parser = new less.Parser();

	var parse = function() {
		parser.parse(lss.doc.getValue(), function (e, tree) {
			try {
				css.setValue(tree.toCSS());
			} catch(err) {
				css.setValue(err.message);
			}
		});
	}

	lss.on('change', function() {
		parse();
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
		}
	}

})();
