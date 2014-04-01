
var surly = require('../src/surly.js');

/*
 * GET users listing.
 */

exports.index = function(req, res){
	var interpreter = new surly;

	var	output = {
		response: interpreter.talk(req.body.sentence)
	};

	res.send(JSON.stringify(output));
};
