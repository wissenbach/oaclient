YUI().use ('io', 'json', 'oop', function (Y) {

	var oacServer = "http://demo.interedition.eu/raxld";

	/** Take the same config object as Y.io() **/
	OAClient.proxy = function (url, cfg) {
		var encodedURL = window.encodeURIComponent(url);
		// var requestURL = OAClient.baseURL + 'ba-simple-proxy-original.php?url=' + encodedURL;
		var requestURL = OAClient.baseURL + 'ba-simple-proxy.php?url=' + encodedURL;
		
		function unwrapConfig (config) {
			var resultConfig = {
				responseText : Y.JSON.stringify(Y.JSON.parse(config.responseText).contents)
			};
			return resultConfig;
		};

		var proxyCfg = Y.clone(cfg);
		
		proxyCfg.on = {
			success: function(transaction, config) { 
				console.log('proxy success');
				
				var status = parseInt(Y.JSON.parse(config.responseText).status.http_code);
				if (status < 400)
					if (cfg.on && cfg.on.success) 
						cfg.on.success (transaction, unwrapConfig(config));
				else
					if (cfg.on && cfg.on.failure) 
						cfg.on.failure (transaction, unwrapConfig(config));
					
			},
			failure: function (transaction, config) {
				console.log('proxy fail');
				if (cfg.on && cfg.on.failure) 
					cfg.on.failure (transaction, unwrapConfig(config));
				
				
			}
		};
				
		Y.io(requestURL, proxyCfg);
		//$.ajax({url: requestURL, dataType: 'json'});
};


	/**
	 * The callback is called with the the URI of the annotation body as 
	 * the only parameter
	 */
	OAClient.storeAnnotationBody = function (content, callback) {
		var url = oacServer + '/annotation_bodies';
		var body =  {
			'mime_type' : 'text/html',
			'content' : content
		}

		var cfg = {
			method: 'POST',
			data: Y.JSON.stringify(body),
			headers: {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json'
			},
			on: {
				success: function(transaction, config) { 
					var createdBodyURI = Y.JSON.parse(config.responseText).annotation_body.uri;
					console.log('successfully created annotation body at ' + createdBodyURI);
					
					if (callback)
						callback(createdBodyURI);
					
				},
				failure: function (transaction, config) {
					console.log('failed to create annotation body!');
				}
			}
		};
		OAClient.proxy(url, cfg);
		//Y.io(url, cfg);
	};

	OAClient.newAnnotation =  function(bodyURI, targetURI, rangeStart, rangeEnd, callback) {
		
		var url = oacServer + '/annotations';

		var constraint = ({
			'checksum' : "",
			'position' : '' + rangeStart + ',' + rangeEnd,
			'context' : ""
		});
		
		var data =  {
			'author_uri' : 'http://authored.by.oaclient',
			'body_uri' : bodyURI,
			'targets' : [{ 
				'uri' : targetURI,
				'constraint' : {
					'constraint_type' : "RFC_5147",
					'constraint' : Y.JSON.stringify(constraint)
				}
			}]
			
		};


		var cfg = {
			method: 'POST',
			data: Y.JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				'Accept' : 'application/json'
			},
			on: {
				success: function(transaction, config) { 
					var annotationURI = Y.JSON.parse(config.responseText).annotation.uri;
					console.log('successfully created annotation at '
								+ rangeStart + ', ' + rangeEnd + ': ' + annotationURI );
					console.log(config);
				},
				failure: function(transaction, config) {
					console.log('failed to create anootation: ' + config);
				}
			}
		};
		
		console.log('sending data:');
		console.log(data);

		OAClient.proxy(url, cfg);
		//Y.io(url, cfg);
	};

	OAClient.getAnnotation = function(uri, callback) {

		var cfg = {
			method: 'GET',
			headers: {
				'Accept' : 'application/json'
			},
			on: {
				success: function(transaction, config) {
					console.log('successfully retrieved annotation:');
					var response = Y.JSON.parse(config.responseText);
					
					if (callback)
						callback(response);					
				},
				failure: function (transaction, config) {
					console.log('failed to retrieve annotation!');
				}
			}
		};
		OAClient.proxy(uri, cfg);
		//Y.io(url, cfg);
	};

	OAClient.queryForAnnotations = function(targetURI, callback) {
		var encodedTargetURI = window.encodeURIComponent(targetURI);
		var url = oacServer + '/annotations/query?q=' + encodedTargetURI;

		var cfg = {
			method: 'GET',
			headers: {
				//'Content-Type' : 'application/json',
				'Accept' : 'application/json'
			},
			on: {
				success: function(transaction, config) { 
					console.log('successful query for annotations:');
					var response = Y.JSON.parse(config.responseText);
					
					if (callback)
						callback(response);					
				},
				failure: function (transaction, config) {
					console.log('failed to query for annotations!');
				}
			}
		};
		OAClient.proxy(url, cfg);
		//Y.io(url, cfg);
	};

	OAClient.parseConstraint = function(constraint) {
		var parsed = Y.JSON.parse(constraint);
		var split = parsed.position.split(',');
		return {
			start: parseInt(split[0]),
			end: parseInt(split[1])
		};
	};
});