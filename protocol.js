YUI().use ('io', 'json', function (Y) {

	var oacServer = "http://50.56.215.106";

	OAClient.proxy = function (url, cfg) {
		var requestURL = OAClient.baseURL + 'ba-simple-proxy-original.php&url=' + url;
		//var requestURL = OAClient.baseURL + 'ba-simple-proxy.php?url=' + url;
		Y.io(requestURL, cfg);
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
		//OAClient.proxy(url, cfg);
		Y.io(url, cfg);
	};

	OAClient.newAnnotation =  function(bodyURI, targetURI, rangeStart, rangeEnd, callback) {
		OAClient.storeAnnotationBody(bodyURI, function(url){

			
			var url = oacServer + '/annotations';

			var constraint = ({
				'checksum' : "",
				'position' : '' + rangeStart + '-' + rangeEnd,
				'context' : ""
			});
			
			var data =  {
				'author_uri' : 'http://authored.by.oaclient',
				'body_uri' : bodyURI,
				'targets' : [{ 
					'uri' : targetURI,
					'constraint' : {
						'constraint_type' : "",
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
					}
				}
			};
			
			console.log('sending data:');
			console.log(data);

			// OAClient.proxy(url, cfg);
			Y.io(url, cfg);
		});
	}

	OAClient.queryForAnnotations = function(targetURI, callback) {
		var url = oacServer + '/annotations/query?q=' + targetURI;

		var cfg = {
			method: 'GET',
			headers: {
				'Content-Type' : 'application/json',
				'Accept' : 'application/json'
			},
			on: {
				success: function(transaction, config) { 
					var response = Y.JSON.parse(config.responseText);
					
					if (callback)
						callback();					
					console.log(response);
				},
				failure: function (transaction, config) {
					console.log('failed to query for annotations!');
				}
			}
		};
		//OAClient.proxy(url, cfg);
		Y.io(url, cfg);

	}
});