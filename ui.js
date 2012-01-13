YUI().use	('node-base', 'node', 'node-load', 'stylesheet', 'event-base', 'overlay', 'widget-anim',
			 'editor-base', 'io', 'selector-css3', 
			 function(Y) {
				 

				 
				 OAClient.getSelectedSpan = function() {
					 
				 }

				 OAClient.AnnotateWidget = function(rangeStart, rangeEnd) {
					 var anchorId = '#charnum' + rangeEnd;
					 var anchor = Y.one(anchorId);
					 
					 var overlay = new Y.Overlay({
						 align: {
							 node: anchor,
							 points:[Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BR]
						 },
						 headerContent: '',
						 bodyContent:'<div class="annotateWindow"><button id="store_button">Store</button></div>',
						 footerContent: '',
						 width : "20em",
						 height: "20em",
						 preventOverlap: true,
						 constrain: true,
						 plugins: [{fn:Y.Plugin.WidgetAnim, duration: 0.5}],
						 visible: false
						 
					 });
					 
					 overlay.render();

					 var editor = new Y.EditorBase({
						 content: '<strong>Add your <em> annotations </em></strong> here ... '
					 });

					 //Add the BiDi plugin
					 editor.plug(Y.Plugin.EditorBidi);

					 //Focusing the Editor when the frame is ready..
					 editor.on('frame:ready', function() {
						 this.focus();
					 });


					 //Rendering the Editor.
					 editor.render('.annotateWindow');

					 Y.one('#store_button').on('click', function() {
						 Y.config.win.getSelection().removeAllRanges();
						 var annotationBody = editor.getContent();
						 OAClient.storeAnnotationBody (annotationBody, function(bodyURL){
							 OAClient.newAnnotation(bodyURL, location.href, rangeStart, rangeEnd);
						 });
						 
						 overlay.destroy(true);
					 });

					 overlay.show();

				 };


				 OAClient.initGUI = function(){

					 Y.one('head').append('<link href="' + 
										  OAClient.baseURL + 'oaclient.css" rel="stylesheet" type="text/css">');

					 Y.one('body').on('mouseup', function(e) {
						 Y.later(20, this, function() {
							 if ( Y.config.win.getSelection().rangeCount > 0) {
								 var selection = Y.config.win.getSelection().getRangeAt(0);

								 if (selection.toString().length > 0) {
									 
									 var startElem = Y.one(selection.startContainer).ancestor('pre');
									 var endElem = Y.one(selection.endContainer).ancestor('pre');
									 
									 var startId = startElem.get('id');
									 var rangeStart = parseInt(startId.substring('charnum'.length, startId.length));

									 var endId = endElem.get('id');
									 var rangeEnd = parseInt(endId.substring('charnum'.length, endId.length));

									 OAClient.plaintextSingleton.getHandle(rangeStart, rangeEnd);
									 new OAClient.AnnotateWidget(rangeStart, rangeEnd);
								 }
							 }});
					 });
				 };
				 
				 OAClient.plaintextSingleton = new OAClient.Plaintext();
				 OAClient.initGUI();
			 });
