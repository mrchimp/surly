var sys = require('sys');
var surly = require('./src/surly.js');

var stdin = process.openStdin();
var sentence = '';
var interpreter = new surly();
var aimlDir = __dirname + '/aiml';

interpreter.loadAimlDir(aimlDir);

console.log('Type something. Type quit to quit.');

stdin.addListener('data', function (d) {
	var sentence = d.toString().substring(0, d.length - 1)

	if (sentence === 'quit') {
		console.log('Yeah, fuck off.');
		process.exit(0);
	}

	console.log('Surly: ' + interpreter.talk(sentence));
});
