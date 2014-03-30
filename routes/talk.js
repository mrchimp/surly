
var surly = require('../src/surly.js');

/*
 * GET users listing.
 */

exports.index = function(req, res){
	var output = {
		response: surly.talk('test')
	};

	res.send(JSON.stringify(output));
};
