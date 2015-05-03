#!/usr/bin/env node

var sys = require('sys');
var surly = require('./src/surly.js');
var pkg = require('./package.json');
var conf = require('rc')('surly', {
    brain: '',      b: '',
    help: false,
    version: false
});

var options = {
    brain: conf.b || conf.brain || __dirname + '/aiml',
    help: conf.help || conf.h,
    version: conf.version,
};

if (options.help) {
    console.log('Surly chat bot command line interface\n\n' + 
        'Options: \n' + 
        '  -b, --brain       AIML directory (aiml/)\n' + 
        '  --help            Show this help message\n' + 
        '  --version         Show version number');
    process.exit();
}

if (options.version) {
    console.log(pkg.version);
    process.exit();
}

var stdin = process.openStdin();
var sentence = '';
var bot = new surly();
var prompt = 'You: ';

bot.loadAimlDir(options.brain);

console.log('Surly: Hello! Type quit to quit or /help for unhelpful help.');

process.stdout.write(prompt);

stdin.addListener('data', function (d) {
	var sentence = d.toString().substring(0, d.length - 1)

	if (sentence === 'quit') {
		console.log('Yeah, fuck off.');
		process.exit(0);
	}

	console.log('Surly: ' + bot.talk(sentence).trim());
	process.stdout.write(prompt);
});
