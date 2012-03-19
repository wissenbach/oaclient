YUI().use('node-base', 'node', 'node-load', 'async-queue', 'stylesheet', 'overlay', function(Y) {

	OAClient.PlaintextHandle = function(start, end) {
		console.log("start: " + start + " end " + end);
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

		var x = startElement.getX();
		var y = startElement.getY();
		var width = endElement.getX() + endElement.get('width') - x;
		var height = endElement.getY() + endElement.get('height') - y;
		
		
		var overlay = new Y.Overlay({
			x: x,
			y: y,
			width: width,
			height: height,
			headerContent: '',
			bodyContent:'<div class="handleOverlay">|</div>',
			footerContent: '',
			plugins: [{fn:Y.Plugin.WidgetAnim, duration: 0.5}],
			visible: false
			
		});
		
		overlay.render();
		overlay.show();
		
		
	};
	
	OAClient.Plaintext = function(){
//
//		/* This function fetches the resource again, which is useful for seeing
//		 the actual offsets*/
//		ajaxReplaceDocument = function() {
//			var new_container = Y.Node.create('<div id="text-container"></div>');
//			var text_container = Y.one('body *');
//			text_container.replace(new_container);
//		};
//
//		/* This function works with what's already in the DOM */
//		wrapPlainText = function(content) {
//			Y.StyleSheet('pre {display: inline;}');
//
//			var new_container = Y.Node.create('<div id="text-container"></div>');
//			var text_container = Y.one('body *');
//			text_container.replace(new_container);
//			
//			var insertQueue = new Y.AsyncQueue();
//			for (var i = 0; i < 2000; i++) {
//				function insert(){
//					var insert_index = i;			
//					insertQueue.add(function(){
//						
//						var char_container = new Y.Node.create('<pre id="charnum' + insert_index + '"></pre>');
//						new_container.append(char_container);
//						char_container.set('text', content.charAt(insert_index));
//					});
//				};
//				insert();
//			}
//			insertQueue.run();
//		};

//		var text_container = Y.one('body *');
//		var content = text_container.getDOMNode().textContent;
//		wrapPlainText(content);
		// ajaxReplaceDocument();
		
	};

	OAClient.Plaintext.prototype.getHandle = function(start, end) {
		return new OAClient.PlaintextHandle(start, end);
	};
	
});