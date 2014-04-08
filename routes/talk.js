/*
 * GET JSON Surly response
 */

exports.index = function(req, res){
	var	output = {
		response: interpreter.talk(req.body.sentence)
	};

	res.send(JSON.stringify(output));
};
