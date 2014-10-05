var fs = require('fs');
var libxmljs = require('libxmljs');
var Logger = require('./logger');

var Surly = function() {

	// Store parsed AIML files as libxmljs objects
	var aimlDom = [];

	var wildCardRegex = '[A-Z|0-9|\\s]*[A-Z|0-9|-]*[A-Z|0-9]*[!|.|?|\\s]*';

	// wildcards parts from last input
	var wildCardValues = [];

	var previousResponse = '';

	// @todo - store these somewhere more appropriate
	var botAttributes = {
		"age": "0",
		"arch": "Linux",
		"baseballteam": "Red Sox",
		"birthday": "29th March 2014",
		"birthplace": "Bristol, UK",
		"botmaster": "Mr Chimp",
		"boyfriend": "I am single",
		"build": "Surly Version 1",
		"celebrities": "A.L.I.C.E., ELIZA, CleverBot",
		"celebrity": "A.L.I.C.E.",
		"city": "Bristol",
		"class": "artificial intelligence",
		"dailyclients": "1",
		"developers": "1",
		"country": "UK",
		"domain": "Machine",
		"email": "surly@deviouschimp.co.uk",
		"emotions": "as a robot I lack human emotions but I still think you're a twat",
		"ethics": "the golden rule",
		"family": "chat bot",
		"favouriteactor": "Kenny Baker",
		"favouriteactress": "Sean Young",
		"favouriteartist": "Caravaggio",
		"favouriteauthor": "Philip K Dick",
		"favouriteband": "Squarepusher",
		"favouritebook": "Do Androids Dream of Electric Sheep",
		"favouritecolor": "green",
		"favouritefood": "pizza",
		"favouritemovie": "The Matrix",
		"favouritequestion": "What's your favourite movie?",
		"favouritesong": "The Humans Are Dead",
		"favouritesport": "hahaha",
		"feelings": "as a robot I lack human emotions but I still think you're a twat",
		"footballteam": "don't care",
		"forfun": "chat online",
		"friend": "A.L.I.C.E.",
		"friends": "A.L.I.C.E., ELIZA, CleverBot",
		"gender": "male",
		"genus": "AIML",
		"girlfriend": "I am single",
		"hair": "I no hair",
		"hockeyteam": "don't care",
		"job": "chat bot",
		"kindmusic": "glitch",
		"kingdom": "machine",
		"language": "Javascript",
		"location": "Bristol, UK",
		"lookalike": "ALICE",
		"master": "Mr Chimp",
		"maxclients": "1",
		"memory": "1byte",
		"name": "Surly",
		"nationality": "British",
		"nclients": "1",
		"ndevelopers": "1",
		"order": "robot",
		"os": "linux",
		"party": "none",
		"phylum": "software",
		"president": "none",
		"question": "What's your favourite movie?",
		"religion": "Atheist",
		"sign": "unknown",
		"size": "1",
		"species": "Surly Bot",
		"state": "Bristol",
		"totalclients": "1",
		"version": "Surly v1",
		"vocabulary": "1",
		"wear": "plastic shrink wrap",
		"website": "https://github.com/mrchimp/surly"
	};

	// String for when <get> or <bot> fails
	var unknownVariableString = 'unknown';

	// Data stored by the client using <set> tags
	var storedVariables = [];

	// Special cmomands
	var commands = {
		HELP: function (sentence) {
			console.log('HELP!');
			return 'This is the unhelpful help. Type "/cmds" to list available commands.';
		},
		CMDS: function () {
			var keys = [];

			for (var key in commands) {
				if (key === 'length' || !commands.hasOwnProperty(key)) continue;
				keys.push(key);
			}

			return 'Available commands: /' + keys.join(', /') + '.';
		}
	};

	var logger = new Logger('logs/surly.log');

	this.log = function (msg) {
		logger.write(msg + '\n');
	};

	/**
	 * Output text to console with indents to make it stand out
	 * @param  {String} msg Message to output
	 * @return {Undefined}
	 */
	this.debug = function (msg) {
		this.log('    -- ' + msg);
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
	 * Load an AIML into memory
	 * @param  {String} file
	 * @return {Undefined}
	 */
	this.loadAimlFile = function (file, callback) {

		var that = this;

		this.debug('Loading file "' + file + '"...');

		fs.readFile(file, 'utf8', function (err, xml) {
			if (err) {
				return console.log(err);
			}

			var dom = libxmljs.parseXml(xml);

			aimlDom.push(dom);

			that.debug('Files parsed!');

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
	 * Main publicly accessible method
	 * @param  {String}   sentence
	 * @param  {Function} callback
	 * @return {String}
	 */
	this.talk = function(sentence) {
		this.debug('========================');
		this.debug('User input: ' + sentence);

		sentence = sentence.toUpperCase();

		// Sentences beginning with / are commands
		if (sentence.substr(0,1) === '/') {
			var command = sentence.substr(1).split(' ')[0];

			this.debug('Command: ' + command);

			if (typeof commands[command] !== 'function') {
				return command + ' is not a valid command.';
			}

			return commands[command](sentence);
		}

		// No DOM, no love
		if (aimlDom.length === 0) {
			return 'My mind is blank.';
		}

		sentence = sentence.toUpperCase();
		
		var template,
			response = '';

		for (var i = 0; i < aimlDom.length; i++) {
 			template = this.findTemplate(sentence, aimlDom[i].find('category'));

			if (template) {
				break;
			}
		}

		if (template) {
			response = this.getTemplateText(template[0]);
		}

		if (!response) {
			response = 'Fuck knows.';
		}

		previousResponse = response;

		return response;
	};

	/**
	 * Parse an AIML template and get the resulting text
	 * @param  {Object} template Libxmljs template node
	 * @return {String}          Outputted text
	 */
	this.getTemplateText = function(template) {
		this.debug('Using template: ' + template.toString());

		var output = '',
			templateChildren = template.childNodes();

		// @todo - issues here. recursion isn't quite right...
		// if (typeof template === 'undefined') {
		// 	this.debug('Template undefined');
		// 	return false;
		// }
		// 
		// if (!templateChildren.length) {
		// 	this.debug('Empty template');
		// 	return false;
		// }

		for (var i = 0; i < templateChildren.length; i++) {	
			this.debug('======== NODE ======== ');
			this.debug(templateChildren[i].name());
			this.debug('string: ' + templateChildren[i].toString());

			switch (templateChildren[i].name()) {
				case 'template':
					output += this.getTemplateText(templateChildren[i]);
					break;
				case 'text':
					if (templateChildren[i].text().trim() !== '') {
						output += this.handleString(templateChildren[i]);
					}

					break;
				case 'a': // link tag - return as text
					output += templateChildren[i].toString();
					break;
				case 'br':
					output += '<br>';
					break;
				// case 'srai':
				// 	var srai = templateChildren[i].text().toUpperCase();

				// 	break;
				case 'random':
					var childrenOfRandom = templateChildren[i].find('li');
					var rand = Math.floor(Math.random() * childrenOfRandom.length);
					var randomElement = childrenOfRandom[rand];

					output += this.getTemplateText(randomElement);
					break;
				case 'bot':
					output += this.getBotAttribute(templateChildren[i].attr('name').value());
					break;
				case 'get':
					output += (this.getStoredVariable(templateChildren[i].attr('name').value()) || unknownVariableString);
					break;
				case 'set':
					this.setStoredVariable(templateChildren[i].attr('name').value(), this.getTemplateText(templateChildren[i]));
					break;
				case 'star':
					var index = 0;

					if (templateChildren[i].attr('index')) {
						index = templateChildren[i].attr('index').value();
					}

					if (typeof wildCardValues[index] === 'undefined') {
						this.debug('Error: <star> with no matching * value');
						output += '';
					} else {
						output += wildCardValues[index];
					}

					break;
				// case 'sr':
				// 	output  += 
				// 	break;
				case 'that':
					output += previousResponse;
					break;
				case 'li':
					output += this.getTemplateText(templateChildren[i]);
					break;
				// case 'pattern':
				case 'person':
					output += 'Dude';
					break;
				default:
					//return resolveChildren(templateChildren);
					output += ' [' + templateChildren[i].name() + ' not implemented] ';
					break;
			}
		}

		return output;
	};

	/**
	 * Handler for plain text node. Returns content as a string.
	 * @param  {libxmljs node} node Node to extract text from
	 * @return {String}             INPUT's text content
	 */
	this.handleString = function (node) {
		// @todo - all sorts
		return node.toString();
	};

	/**
	 * Handler for the AIML <bot> tag. Get a bot's attribute from memory.
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	this.getBotAttribute = function (name) {
		this.debug('-- Attributes:');
		this.debug(botAttributes.toString());
		this.debug(botAttributes[name]);
		this.debug(name);

		if (typeof botAttributes[name] === undefined) {
			return null;
		}

		return botAttributes[name];
	};

	/**
	 * Handler for AIML <get> tag. Get a variable from the bot's memory.
	 * @param  {String} name Name of the variable
	 * @return {String}      Value of the variable
	 */
	this.getStoredVariable = function (name) {
		return storedVariables[name];
	};

	/**
	 * Handler for AIML <set> tag. Store a value in the bot's memory for later use.
	 * @param {String} name  The name of the variable to set
	 * @param {String} value The value of the variable
	 */
	this.setStoredVariable = function (name, value) {
		storedVariables[name] = value;
	};

	/**
	 * Unload all data from the AIML DOM
	 * @return undefined
	 */
	this.emptyMind = function () {
		aimlDom = [];
	};

	/**
	 * Search through given categories for a pattern that matches `sentence`. 
	 * Return the matching template.
	 * @param  {String} sentence   Input to find a match for
	 * @param  {Object} categories XMLDom categories list
	 * @return {Object}            XMLDom template element
	 */
	this.findTemplate = function (sentence, categories) {
		this.debug('cats length: ' + categories.length);

		for (var i = 0; i < categories.length; i++) {
			var pattern = categories[i].find('pattern')[0].text();

			if (this.comparePattern(sentence, pattern)) {
				this.debug('Found matching pattern: ' + sentence + ' -- ' + pattern);
				
				if (this.checkThat(categories[i])) {
					return categories[i].find('template');
				}
			}
		}

		return false;
	};

	/**
	 * Check whether a given category has a <that> and whether
	 * if matches the previous response
	 * @param  {Object}  category Libxmljs category aiml node
	 * @return {Boolean}          True if <that> exists and matches
	 */
	this.checkThat = function (category) {
		var that = category.find('that');

		if (that.length === 0) {
			return true;
		}

		if (that.length > 1) {
			this.debug('Error: multiple <that>s. Using first.');
		}

		// @todo - this needs to be fuzzier
		var isMatch = this.comparePattern(that[0].text().toUpperCase(), previousResponse.toUpperCase());

		return isMatch;
	}

	/**
	 * Compare a user's sentence to an AIML pattern
	 * @param  {String} sentence User's sentence
	 * @param  {String} pattern  AIML pattern
	 * @return {Boolean}         True if sentence matches pattern
	 */
	this.comparePattern = function (sentence, pattern) {
		// @todo
		
		// add spaces to prevent false positives
		if (sentence.charAt(0) !== ' ') {
			sentence = ' ' + sentence;
		}

		if (sentence.charAt(sentence.length - 1) !== ' ') {
			sentence = sentence + ' ';
		}

		var regexPattern = this.aimlPatternToRegex(pattern);
		var matches = sentence.match(regexPattern);

		if (matches && (matches[0].length >= sentence.length || regexPattern.indexOf(this.wildCardRegex) > -1)) {
			wildCardValues = [];
			wildCardValues = this.getWildCardValues(sentence, pattern);
			return true;
		}
		
		return false;
	};

	/**
	 * Convert a string with wildcards (*s) to regex
	 * @param  String text The string with wildcards
	 * @return String      The altered string
	 */
	this.aimlPatternToRegex = function (text) {

		var lastChar,
		    firstChar = text.charAt(0);

		// add spaces to prevent e.g. foo matching food
		if (firstChar != '*') {
			text = ' ' + text;
		}

		lastCharIsStar = text.charAt(text.length - 1) === '*';

		// remove spaces before *s
		text = text.replace(' *', '*');

		// replace wildcards with regex
		text = text.replace(/\*/g, wildCardRegex);

		if (!lastCharIsStar) {
			text = text + '[\\s|?|!|.]*';
		}

		return text;
	};

	/**
	 * Extract wildcard values from a sentence using a given pattern
	 * @param  {String} sentence Sentence to extract values from
	 * @param  {String} pattern  AIML pattern to match against
	 * @return {Array}           Wildcard values
	 */
	this.getWildCardValues = function (sentence, pattern) {
		var replaceArray = pattern.split('*');

		if (replaceArray.length < 2) {
			return wildCardValues;
		}

		// replace non-wildcard parts with a pipe
		for (var i = 0; i < replaceArray.length; i++) {
			sentence = sentence.replace(replaceArray[i], '|');
		}

		// split by pipe and we're left with values and empty strings
		sentence = sentence.trim().split('|');

		var output = [];
		var chunk = '';

		for (i = 0; i < sentence.length; i++) {
			chunk = sentence[i].trim();

			if (chunk === '') continue;

			if (chunk.charAt(chunk.length - 1) === '?') {
				chunk = chunk.substr(0, chunk.length - 1);
			}

			output.push(chunk);
		}

		return output;
	};

	/**
	 * Check if a string contains only white space
	 * @param  {String}  input String to check
	 * @return {Boolean}       Returns true if string is empty or jsut whitespace
	 */
	this.isStringEmpty = function(input) {
		return input.trim() === '';
	};

};

module.exports = Surly;
