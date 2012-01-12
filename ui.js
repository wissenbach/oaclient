OAClient = {
	baseURL: _oac_base
};


YUI({
	// gallery: 'gallery-2011.05.04-20-03'
}).use	('node-base', 'node', 'node-load','async-queue',
		 'stylesheet', 'event-base', 
		 'overlay', 'widget-anim', 'editor-base', 'io',function(Y) {

			   OAClient.wrapPlainText = function(content) {
				   Y.StyleSheet('pre {display: inline;}');

				   var new_container = Y.Node.create('<div id="text-container"></div>');
				   var text_container = Y.one('body *');
				   text_container.replace(new_container);
				   
				   var insertQueue = new Y.AsyncQueue();
				   for (var i = 0; i < 2000; i++) {
					   function insert(){
						   var insert_index = i;			
						   insertQueue.add(function(){
											   
											   var char_container = new Y.Node.create('<pre charnum="' + insert_index + '"></pre>');
											   new_container.append(char_container);
											   char_container.set('text', content.charAt(insert_index));
										   });
					   };
					   insert();
				   }
				   insertQueue.run();
			   };

			   OAClient.replacePlainTextDOM = function() {
				   var text_container = Y.one('body *');
				   var content = text_container.getDOMNode().textContent;
				   OAClient.wrapPlainText(content);
			   };
			   
			   OAClient.initGUI = function(){

				   Y.one('head').append('<link href="' + 
										OAClient.baseURL + 'oaclient.css" rel="stylesheet" type="text/css">');

				   Y.one('body').on('mouseup', function(e) {
										Y.later(20, this, function() {
													if ( Y.config.win.getSelection().rangeCount > 0) {
														var selection = Y.config.win.getSelection().getRangeAt(0);

														if (selection.toString().length > 0) {

															var anchor = Y.one(selection.endContainer).ancestor('pre');

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
																						  overlay.destroy(true);
																					  });

															overlay.show();

														}
													}});
									});
			   };


			 OAClient.replacePlainTextDOM();
			 OAClient.initGUI();
			 // oacGetAnnotations(function(responseText){
				 // alert(responseText);
			 // });

			 oacStoreAnnotationBody ('hello', null);
		   });
