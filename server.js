var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    ent = require('ent'),
    fs = require('fs')
    surly = require('./src/surly.js');

server.listen(8080, "0.0.0.0");

console.log(surly.talk('hi'));

app.use(express.static(__dirname + '/public'));
