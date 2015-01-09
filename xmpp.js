#!/usr/bin/env node
'use strict';

var surly = require('./src/surly');
var xmpp = require('simple-xmpp');
var pkg = require('./package.json');
var conf = require('rc')('surly', {
    username: '',   u: '',
    password: '',   p: '',
    host: '',       h: '',
    port: '',       P: '',
    brain: '',      b: '',
    addcontact: '', a: '',
    help: false,
    version: false
})

var options = {
    username: conf.u || conf.username || '',
    password: conf.p || conf.password || '',
    host: conf.h || conf.host || 'talk.google.com',
    port: conf.P || conf.port || 5222,
    addcontact: conf.a || conf.addcontact,
    brain: conf.b || conf.brain || __dirname + '/aiml',
    help: conf.help || conf.h,
    version: conf.version,
};

if (options.help) {
    console.log('Surly chat bot XMPP client\n\n' + 
        'Options: \n' + 
        '  -u, --username    XMPP username ()\n' + 
        '  -p, --password    XMPP password ()\n' + 
        '  -h, --host        XMPP host     (talk.google.com)\n' + 
        '  -P, --port        XMPP port     (5222)\n' + 
        '  -b, --brain       AIML directory (./aiml)\n' + 
        '  -a, --addcontact  Username to add to contacts\n' + 
        '  --help            Show this help message\n' + 
        '  --version         Show version number');
    process.exit();
}

if (options.version) {
    console.log(pkg.version);
    process.exit();
}

var bot = new surly();
bot.loadAimlDir(options.brain);

xmpp.on('online', function(data) {
    if (options.addcontact) {
        xmpp.subscribe(options.addcontact);
        console.log('Request sent to ' + options.addcontact);
        xmpp.disconnect();
        process.exit();
    }

    console.log('Online!');
});

xmpp.on('close', function() {
    console.log('Offline!');
});

xmpp.on('chat', function(from, message) {
    console.log(from + ': ' + message);
    var response = bot.talk(message);
    console.log('Surly: ' + response);
    xmpp.send(from, response);
});

xmpp.on('groupchat', function(conference, from, message, stamp) {
    // @todo - handle this!
    console.log('%s says %s on %s on %s at %s', from, message, conference, stamp.substr(0,9), stamp.substr(10));
});

xmpp.on('error', function(err) {
    console.error(err);
});

xmpp.on('subscribe', function(from) {
    // @todo - handle this!
    console.log('got subscribe request from ' + from);
    // xmpp.acceptSubscription(from);
});

console.log('Connecting to ' + options.username + '@' + options.host + ':' + options.port + ' (' + (options.password ? 'password' : 'no password') + ')...');

xmpp.connect({
    jid             : options.username,
    password        : options.password,
    host            : options.host,
    port            : options.port
});

xmpp.getRoster(); // check for incoming subscription requests
