YUI().use ('io', 'json', function (Y) {

	var oacServer = "http://50.56.215.106";

	OAClient.proxy = function (url, cfg) {
		var requestURL = OAClient.baseURL + 'ba-simple-proxy.php?url=' + url;
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
				'Content-Type': 'application/json'
			},
			on: {
				success: function(transaction, config) { 
					if (callback)
						callback(Y.JSON.parse(config.responseText).headers.Location);
				}
			}
		};
		OAClient.proxy(url, cfg);
	};

	OAClient.newAnnotation =  function(bodyURI, targetURI, rangeStart, rangeEnd, callback) {
		OAClient.storeAnnotationBody(bodyURI, function(url){
			console.log('Creating Annotation: ' + rangeStart + ', ' + rangeEnd + ': ' + url );
			
		var url = oacServer + '/annotations';
		var data =  {
			'author_uri' : 'http://authored.by.oaclient',
			'body_uri' : bodyURI,
			'targets' : [{ 
				'uri' : targetURI,
				'constraint' : {
					'checksum' : null,
					'position' : '' + rangeStart + '-' + rangeEnd,
					'context' : null
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
					console.log(Y.JSON.parse(config.responseText));						
				}
			}
		};
		OAClient.proxy(url, cfg);
			
		});
	}
	
});