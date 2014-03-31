
var Surly = require('../src/surly.js');

/*
 * GET users listing.
 */

exports.index = function(req, res){

	var surly = new Surly,
	output = {
		response: surly.talk(req.body.sentence, function () {
			res.send(JSON.stringify(output));
		})
	};
};
