var fs = require('fs');
var xmlParser = require('xmldom').DOMParser;

var Surly = function() {

	var aimlDom = [];

	var previousResponse = '';

	var commands = {
		help: function (sentence) {
			console.log('HELP!');
			return 'This is the unhelpful help. Type "/cmds" to list available commands.';
		},
		cmds: function () {
			var keys = [];

			for (var key in commands) {
				if (key === 'length' || !commands.hasOwnProperty(key)) continue;
				keys.push(key);
			}

			return 'Available commands: /' + keys.join(', /') + '.';
		}
	};

	/**
	 * Unload all data from the AIML DOM
	 * @return undefined
	 */
	this.emptyMind = function () {
		aimlDom = [];
	};

	/**
	 * Load an AIML into memory
	 * @param  {String} file
	 * @return {Undefined}
	 */
	this.loadAimlFile = function (file, callback) {
		console.log('Loading file "' + file + '"...');

		fs.readFile(file, 'utf8', function (err, xml) {
			if (err) {
				return console.log(err);
			}

			console.log('Parsing AIML files...');
			aimlDom.push(new DOMParser.parseFromString(xml));
			console.log('Files parsed!');

			// function (err, result) {
			// 	if (err) {
			// 		callback(err);
			// 		return;
			// 	}
			// 	aimlDom.push(result);
			// 	callback(err);
			// });
		});
	};

	/**
	 * Find files in a dir and run loadAimlFile on them
	 * @param  {String} dir
	 * @return {Undefined}
	 */
	this.loadAimlDir = function (dir, callback) {
		var files = fs.readdirSync(dir);

		for (var i in files) {
			if (!files.hasOwnProperty(i)) continue;

			var name = dir + '/' + files[i];

			if (fs.statSync(name).isDirectory()) {
				console.log('ignoring directory: ' + name);
			} else {
				this.loadAimlFile(name, callback);
			}
		}
	};

	/**
	 * Main publicly accessible method
	 * @param  {String}   sentence
	 * @param  {Function} callback
	 * @return {String}
	 */
	this.talk = function(sentence) {
		// Sentences beginning with / are commands
		if (sentence.substr(0,1) === '/') {
			return commands[sentence.substr(1).split(' ')[0]](sentence);
		}

		// No DOM, no love
		if (aimlDom.length === 0) {
			return 'My mind is blank.';
		}

		sentence = sentence.toUpperCase();
		
		var response = '';

		for (var i = 0; i < aimlDom.length; i++) {
			response = this.findCategory(sentence, aimlDom[i]);
			if (response) {
				break;
			}
		}

		if (!response) {
			response = 'Fuck knows.';
		} else {
			previousResponse = response;
		}

		return response;

	};

	this.findCategory = function (sentence, categories) {
		for (var i = 0; i < categories.length; i++) {
			if (categories[i].name === 'category') {
				console.log('ping');
			}
		}
	}
}

module.exports = Surly;