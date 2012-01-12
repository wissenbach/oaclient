// load and execute script files
// in this order

function _oac_bootstrap(script_list) {
	if (script_list.length < 1)
		return;
	var script = document.createElement('script');
	script.type='text/javascript';
	script.src = script_list.shift();
	script.onload = function() {_oac_bootstrap(script_list)};
	document.getElementsByTagName('head')[0].appendChild(script);
}

_oac_bootstrap([
	'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
	'http://yui.yahooapis.com/3.4.1/build/yui/yui-min.js',
	_oac_base + 'protocol.js',
	_oac_base + 'ui.js',

]);
