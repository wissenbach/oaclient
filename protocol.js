var oacServer = "http://87.106.12.254:3000";

var oacGetAnnotations = function(uri, callback) {
	
	xmlhttp = new XMLHttpRequest();
	
	var requestURL = oacServer + '/annotations/query?q=' + location.href;
	xmlhttp.open("GET", oacServer,true);
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4) {
			callback(xmlhttp.responseText);
		}
	}
	xmlhttp.send(null)
	

};


var oacStoreAnnotationBody = function(content, callback) {
	var requestURL = oacServer + '/annotation_bodies';
	var send =  {
		'mime_type' : 'text/html',
		'content' : content
	}

	$.ajax ({
		type: 'POST',
		url: requestURL,
		data: content,
		success: function ( data ) {
			callback (data);
		}
	});

}