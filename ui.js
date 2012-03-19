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
							 console.log('The new annotation body is at: ' + bodyURL);
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

				 OAClient.renderAnnotations = function() {
					 
					 console.log('Rendering annotations.');
					 
					 OAClient.plaintextSingleton.clearHandles();
					 Y.each (OAClient.annotations, function(annotation) {
						 OAClient.plaintextSingleton.getHandle(
							 annotation.get('posFrom'),
							 annotation.get('posTo')
						 )
					 });


				 };
				 

				 function insertAnnotations(annotations) {

					 OAClient.annotations = new OAClient.AnnotationList();
					 
					 OAClient.annotations.after(['add', 'remove', 'reset', '*:change'], 
												 OAClient.renderAnnotations, OAClient);
					 // FIXME quick fix: when there are no annotations yet, the
					 // variable annotations is of type string and has the value '"[]"'
					 if (typeof annotations !== 'string')
						 Y.each(annotations, function(annotation) {
							 
							 console.log('Adding annotation: ');
							 var annotationURI =  annotation.annotation.uri;
							 console.log(annotation);
							 OAClient.getAnnotation(annotationURI, function(response) {
								 console.log(response);
								 var constraint = 
									 response.annotation.annotation_target_instances[0].
									 annotation_target_instance.annotation_constraint.constraint;
								 var range = OAClient.parseConstraint(constraint);
								 if (range) {
									 console.log(range);
									 var annotationM = new OAClient.AnnotationModel({
						 				 uri: annotationURI,
										 posFrom : range.start,
										 posTo : range.end
						 			 });
									 console.log('validating annotation...');
									 var validationError = annotationM.validate(annotationM.getAttrs());
									 console.log(validationError);
									 if (!validationError)
										 OAClient.annotations.add(annotationM);
								 }
							 });
							 
						 });
				 }
				 OAClient.plaintextSingleton = new OAClient.Plaintext(function(){
					 OAClient.queryForAnnotations(location.href, insertAnnotations);
				 });
				 
				 OAClient.initGUI();

				 
			 });
