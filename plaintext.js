YUI().use('node-base', 'node', 'node-load', 'async-queue', 'stylesheet', 'overlay', function(Y) {

	OAClient.PlaintextHandle = function(start, end) {
		console.log("start: " + start + " end " + end);
		this.start = start;
		this.end = end;
		this.destroy = function() {};

		var startSel = '#charnum' + start;
		var startElement = Y.one(startSel);
		var endSel = '#charnum' + end;
		var endElement = Y.one(endSel);

		// FIXME don't be silent if the target cannot be found
		if (startElement && endElement) {
			startElement.setStyles({
				'borderLeft' : '1px solid black',
				'borderTop' : '1px solid black',
				'borderBottom' : '1px solid black',
				'backgroundColor' : 'yellow'
			});

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
			
			
			this.overlay = new Y.Overlay({
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
			
			this.overlay.render();
			this.overlay.show();

			this.destroy = function() {
				this.overlay.destroy();
			};
		}
		
	};


	OAClient.Plaintext = function(callback, targetUri){
		// store a list of active handles
		this.handles = [];

		this.clearHandles = function() {
			Y.each(this.handles, function(h){
				h.destroy();
			});
			this.handles = [];
		};
		
		OAClient.annotationTarget = 
			new OAClient.AnnotationTarget(location.href, callback);

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
//			if (callback)
//				insertQueue.add(callback);
//			insertQueue.run();
//		};
//
//		var text_container = Y.one('body *');
//		var content = text_container.getDOMNode().textContent;
//		wrapPlainText(content);
	};

	OAClient.Plaintext.prototype.getHandle = function(start, end) {
		var result = new OAClient.PlaintextHandle(start, end);
		this.handles.push(result);
		return result;
	};
	
});
