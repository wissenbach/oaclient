YUI().use('node-base', 'node', 'node-load', 'async-queue', 'stylesheet', function(Y) {

	OAClient.PlaintextHandle = function(start, end) {

		this.start = start;
		this.end = end;

		var startSel = '#charnum' + start;
		var startElement = Y.one(startSel);
		startElement.setStyles({
			'borderLeft' : '1px solid black',
			'borderTop' : '1px solid black',
			'borderBottom' : '1px solid black',
			'backgroundColor' : 'yellow'
		});

		var endSel = '#charnum' + end;
		var endElement = Y.one(endSel);
		endElement.setStyles({
			'borderRight' : '1px solid black',
			'borderTop' : '1px solid black',
			'borderBottom' : '1px solid black',
			'backgroundColor' : 'yellow'
		});
		
	};
		
	OAClient.Plaintext = function(){

		wrapPlainText = function(content) {
			Y.StyleSheet('pre {display: inline;}');

			var new_container = Y.Node.create('<div id="text-container"></div>');
			var text_container = Y.one('body *');
			text_container.replace(new_container);
			
			var insertQueue = new Y.AsyncQueue();
			for (var i = 0; i < 2000; i++) {
				function insert(){
					var insert_index = i;			
					insertQueue.add(function(){
						
						var char_container = new Y.Node.create('<pre id="charnum' + insert_index + '"></pre>');
						new_container.append(char_container);
						char_container.set('text', content.charAt(insert_index));
					});
				};
				insert();
			}
			insertQueue.run();
		};

		var text_container = Y.one('body *');
		var content = text_container.getDOMNode().textContent;
		wrapPlainText(content);
		
	};

	OAClient.Plaintext.prototype.getHandle = function(start, end) {
		return new OAClient.PlaintextHandle(start, end);
	}
	
});