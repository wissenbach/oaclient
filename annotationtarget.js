YUI().use('node', 'async-queue', 'stylesheet', 'json', function(Y) {
	
	OAClient.AnnotationTarget = function(targetUri, callback) {
		
		function loadTarget(targetUri, loadTargetHandler) {
			var cfg = {
					method: 'GET',
					headers: {
						//'Content-Type' : 'application/json',
						'Accept' : 'text/plain'
					},
					on: {
						success: function(transaction, config) { 
							console.log('successful loaded the anno target:');
							var response = Y.JSON.parse(config.responseText);
							
							if (loadTargetHandler)
								loadTargetHandler(response);					
						},
						failure: function (transaction, config) {
							console.log('failed to load target!');
						}
					}
				};
				OAClient.proxy(targetUri, cfg);
		};

		wrapPlainText = function(content) {
			var bomTest = content.substr(0,1);
			if (bomTest.charCodeAt(0) == 65279) { //bom
				content = content.substr(1,content.length);
			}
			Y.StyleSheet('pre {display: inline;}');

			var new_container = Y.Node.create('<div id="text-container"></div>');
			var text_container = Y.one('body *');
			text_container.replace(new_container);
			
			var insertQueue = new Y.AsyncQueue();
			for (var i = 0; i < 2000; i++) {
				function insert(){
					var insert_index = i;			
					insertQueue.add(function(){
						var char_container = 
							new Y.Node.create(
								'<pre id="charnum' + insert_index + '"></pre>');
						new_container.append(char_container);
						char_container.set('text', content.charAt(insert_index));
					});
				};
				insert();
			}
			if (callback) {
				insertQueue.add(callback);
			}
			insertQueue.run();
		};
		
		function handleLoadedTarget(content) {
			wrapPlainText(content);
		}
		
		loadTarget(targetUri, handleLoadedTarget);
		
	};	
	
});