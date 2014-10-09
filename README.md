surly
=====

 > **surly** *adjective*
 > 
 >  1. bad-tempered and unfriendly

Surly is a node.js AIML interpreter.


Project Status
==============

Kind of works a bit. See `coverage.md` for more info.


Requirements
============

 * [Node.js](http://nodejs.org/)
 * [NPM](https://www.npmjs.org/)


Installation
============

 1. Aquire code.
 2. `npm install`
 3. `bower install`
 4. `grunt`


Usage
=====

Run a web server
----------------

 1. `sudo node server.js`
 2. Obey on-screen instructions.


Use in the terminal
-------------------

`node cli.js`


Run as XMPP client
------------------

`node xmpp.js`


Config
======

Config files and read by `rc`. Any flag shown in `--help` can be set in the options file.


Directory Structure
===================

    |
    ├── aiml - This is where the bot's brain goes.
	|
    ├── frontend_src - Code that will be compiled into /public.
    |                  Create new frontend js/less/etc here.
    |
    ├── logs - Chat logs.
    |
    ├── node_modules - Box of magic. Do not touch. Do not git.
    |
    ├── public - Files directly accessable to client via HTTP
    |    |
    |    ├── bower_components - Publicly available magic. 
    |    |                      Do not touch, DO git.
    |    |
    |    └── js - js files end up here. You probably don't want 
    |             to create files here directly.
    |
    ├── routes - Map URLs to functions.
    |
    ├── src - The meat and potatoes.
    |
    ├── views - Template file - [EJS format](http://embeddedjs.com/)
    |
    ├── cli.js - Run Surly in the terminal.
    |
    ├── bower.json - Manage frontend dependencies.
    |
    ├── Gruntfile.js - Configure how project is compiled.
    |
    ├── package.json - Manages server-side (node/npm) dependencies.
    |
    ├── server.js - Run Surly as a web server.
    |
  	└── xmpp.js - Run Surly as a XMPP server.


Things Surly should be able to reply to (an inconclusive list)
==============================================================

 * What is NOUN?
 * NOUN is DEFINITION.


Todo
====

Proper input normalization: http://www.alicebot.org/TR/2001/WD-aiml/#section-input-normalization
