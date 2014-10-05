#!/usr/bin/env node

var sys = require('sys');
var surly = require('./src/surly.js');

var stdin = process.openStdin();
var sentence = '';
var interpreter = new surly();
var aimlDir = __dirname + '/aiml';
var prompt = 'You: ';

// interpreter.loadAimlFile(__dirname + '/aiml/0000test.aiml');
interpreter.loadAimlDir(aimlDir);

console.log('Surly: Hello! Type quit to quit or /help for unhelpful help.');

process.stdout.write(prompt);

stdin.addListener('data', function (d) {
	var sentence = d.toString().substring(0, d.length - 1)

	if (sentence === 'quit') {
		console.log('Yeah, fuck off.');
		process.exit(0);
	}

	console.log('Surly: ' + interpreter.talk(sentence).trim());
	process.stdout.write(prompt);
});
