var fs = require('fs');
var libxmljs = require('libxmljs');
var Logger = require('./logger');
var Stack = require('./stack');

var Surly = function() {

	var aimlDom = [],
		wildCardRegex = '[A-Z|0-9|\\s]*[A-Z|0-9|-]*[A-Z|0-9]*[!|.|?|\\s]*',
		wildcard_stack = new Stack(10),
		input_stack = new Stack(10),
		// wildCardValues = [],
		previousResponse = '',
		unknownVariableString = 'unknown',
		storedVariables = {},
		botAttributes = { // @todo - store these somewhere more appropriate
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
			"favouritesport": "pong",
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
		},
		commands = {
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
		},
		inventory = [
			'The beat',
			'A blueberry muffin',
			'Sweden'
		],
		logger = new Logger('logs/surly.log');

	this.log = function (msg) {
		logger.write(msg + '\n');
	};

	/**
	 * Output text to console with indents to make it stand out
	 * @param  {String} msg Message to output
	 * @return {Undefined}
	 */
	this.debug = function (msg) {
		this.log(msg);
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
		});
	};

	/**
	 * Main publicly accessible method
	 * @param  {String}   sentence
	 * @param  {Function} callback
	 * @return {String}
	 */
	this.talk = function(sentence) {
		var i,
			template,
			command = '',
			response = '';

		this.debug('========================');
		this.debug('User input: ' + sentence);

		input_stack.push(sentence);

		// Sentences beginning with / are commands
		if (sentence.substr(0,1) === '/') {
			command = sentence.substr(1).split(' ')[0];

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

		for (i = 0; i < aimlDom.length; i++) {
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

		previousResponse = this.normaliseTemplate(template);

		return response;
	};

	/**
	 * Convert a XML type template to a pattern-style string
	 * @param  {XML Object or String} text AIML Template
	 * @return {[type]}      Normalised template
	 */
	this.normaliseTemplate = function (text) {
		return text
			.toString()
			.replace(/<star ?\S*\/?>/gi, '*')
			.replace(/<template>|<\/template>/gi, '')
			.toUpperCase();
	}

	/**
	 * Parse an AIML template and get the resulting text
	 * @param  {Object} template Libxmljs template node
	 * @return {String}          Outputted text
	 */
	this.getTemplateText = function(template) {
		this.debug('Using template: ' + template.toString());

		var i,
			output = '',
			children = template.childNodes();

		// @todo - issues here. recursion isn't quite right...
		// if (typeof template === 'undefined') {
		// 	this.debug('Template undefined');
		// 	return false;
		// }
		// 
		// if (!children.length) {
		// 	this.debug('Empty template');
		// 	return false;
		// }

		for (i = 0; i < children.length; i++) {	
			this.debug('======== NODE ======== ');
			this.debug(children[i].name());
			this.debug('string: ' + children[i].toString());

			switch (children[i].name()) {
				case 'template':
					output += this.getTemplateText(children[i]);
					break;
				case 'text':
					if (children[i].text().trim() !== '') {
						output += this.handleString(children[i]);
					}

					break;
				case 'a': // link tag - return as text
					output += children[i].toString();
					break;
				case 'br':
					output += '<br>';
					break;
				case 'srai':
					output += this.talk(this.getTemplateText(children[i]));
					break;
				case 'random':
					var childrenOfRandom = children[i].find('li'),
					    rand = Math.floor(Math.random() * childrenOfRandom.length),
					    randomElement = childrenOfRandom[rand];

					output += this.getTemplateText(randomElement);
					break;
				case 'bot':
					output += this.getBotAttribute(children[i].attr('name').value());
					break;
				case 'get':
					if (children[i].attr('name') && this.getStoredVariable(children[i].attr('name').value())) {
						output += this.getStoredVariable(children[i].attr('name').value());
					} else if (children[i].attr('default')) {
						output += children[i].attr('default').value();
					} else {
						output += unknownVariableString;
					}
					break;
				case 'set':
					this.setStoredVariable(children[i].attr('name').value(), this.getTemplateText(children[i]));
					break;
				case 'star':
					var index = 0,
							wildcards;

					if (children[i].attr('index')) {
						index = children[i].attr('index').value() - 1;
					}

					wildcards = wildcard_stack.getLast();

					if (typeof wildcards[index] === 'undefined') {
						this.debug('Error: <star> with no matching * value');
					} else {
						output += wildcards[index];
					}

					break;
				case 'sr':
					output += this.talk(wildcard_stack.getLast()[0]);
					break;
				case 'inventory':
					var action = children[i].attr('action').value();

					switch (action) {
						case 'swap':
							if (inventory.length > 0) {
								this.setStoredVariable('last_dropped', inventory.shift());
							}
							inventory.push(this.getTemplateText(children[i]));
							break;
						case 'list':
							output += 'I am carrying ' + inventory.join(', ') + '. ';
							break;
						default:
							this.debug('Invalid inventory action: ' + action);
					}
					break;
				case 'that':
					output += previousResponse;
					break;
				case 'thatstar':
					var wildcards = wildcard_stack.get(-1)[0],
						index = 0;

					if (children[i].attr('index')) {
						index = children[i].attr('index').value() - 1;
					}

					if (!wildcards) {
						this.debug('Error: <thatstar> with no matching * value.');
					} else {
						output += wildcards[index];
					}

					break;
				case 'li':
					output += this.getTemplateText(children[i]);
					break;
				// case 'pattern':
				case 'person':
					output += 'Dude';
					break;
				case 'think':
					// Parse template but don't output results
					this.getTemplateText(children[i]); 
					break;
				case 'input':
					var input = 1;
					children[i].attr('index').value()
					output += input_stack.get(-input);
					break;
				default:
					//return resolveChildren(children);
					output += ' [' + children[i].name() + ' not implemented] ';
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

		return that[0].text() === previousResponse.toUpperCase();

		return isMatch;
	}

	/**
	 * Compare a user's sentence to an AIML pattern
	 * @param  {String} sentence User's sentence
	 * @param  {String} pattern  AIML pattern
	 * @return {Boolean}         True if sentence matches pattern
	 */
	this.comparePattern = function (sentence, aiml_pattern) {
		// @todo
		// add spaces to prevent false positives
		if (sentence.charAt(0) !== ' ') {
			sentence = ' ' + sentence;
		}

		if (sentence.charAt(sentence.length - 1) !== ' ') {
			sentence = sentence + ' ';
		}

		sentence = sentence.toUpperCase(); // @todo - remove this

		var regex_pattern = this.aimlPatternToRegex(aiml_pattern);
		var matches = sentence.match(regex_pattern);

		if (matches && (matches[0].length >= sentence.length || regex_pattern.indexOf(this.wildCardRegex) > -1)) {
			wildcard_stack.push(this.getWildCardValues(sentence, aiml_pattern));
			return true;
		}
	
		return false;
	};

	/**
	 * Convert a string with wildcards (*s) to regex
	 * @param  String pattern The string with wildcards
	 * @return String      The altered string
	 */
	this.aimlPatternToRegex = function (pattern) {
		var lastChar,
		    firstChar = pattern.charAt(0);

		// add spaces to prevent e.g. foo matching food
		if (firstChar != '*') {
			pattern = ' ' + pattern;
		}

		lastCharIsStar = pattern.charAt(pattern.length - 1) === '*';

		// remove spaces before *s
		pattern = pattern.replace(' *', '*');

		// replace wildcards with regex
		pattern = pattern.replace(/\*/g, wildCardRegex);

		if (!lastCharIsStar) {
			pattern = pattern + '[\\s|?|!|.]*';
		}

		return pattern;
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
			return wildcard_stack.getLast();
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
