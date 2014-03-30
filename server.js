var express = require('express');
var http = require('http');
var server = http.createServer(app);
var ent = require('ent');
var fs = require('fs');
var path = require('path');
var routes = require('./routes');
var talk = require('./routes/talk');
var surly = require('./src/surly.js');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/talk', talk.index);


app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(app.get('port'), function(){
    console.log('Surly server\'s listening on port fucking ' + app.get('port') + ', alright?');
    console.log('Surly says: "' + surly.talk('bootmsg') + '"');
});
