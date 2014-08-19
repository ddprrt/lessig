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

	lss.on('change', function() {
		parser.parse(lss.doc.getValue(), function (e, tree) {
			try {
				css.setValue(tree.toCSS());
			} catch(e) {
				css.setValue(e.message);
			}
		});
	});

	return {
		setLess: function(code) {
			lss.setValue(code);
		}
	}

})();
