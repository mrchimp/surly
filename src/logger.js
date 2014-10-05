
var fs = require('fs');


/**
 * Simple logging system.
 * @param {String} logfile Path to log file.
 */
var Logger = function (logfile) {

	var stream = fs.createWriteStream(logfile);

	stream.on('error', function (err) {
		console.log('logger error: ' + err);
	});

	this.write = function (msg) {
		stream.write(msg, 'utf8');
	}

};

module.exports = Logger;