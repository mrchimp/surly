
var fs = require('fs');


/**
 * Simple logging system. Logs data to end of given
 * text file, archives files above a given size.
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