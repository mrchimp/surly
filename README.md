surly
=====

 > **surly** *adjective*
 > 
 >  1. bad-tempered and unfriendly

Surly is a node.js AIML interpreter.


Project Status
==============

Kind of works a bit.


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

 1. `$ sudo node server.js`
 2. Obey on-screen instructions.

Use in the terminal
-------------------

 1. `$ node cli.js`


Directory Structure
===================

    |
    ├── aiml - This is where the bot's brain goes.
	|
    ├── frontend_src - Code that will be compiled into /public.
    |                  Create new frontend js/less/etc here.
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
    ├── routes - Map URLs to functions
    |
    ├── views - Template file - [EJS format](http://embeddedjs.com/)
    |
    ├── Gruntfile.js - Configure how project is compiled
    |
    ├── bower.json - Manage frontend dependencies
    |
    ├── package.json - Manages server-side (node/npm) dependencies.
    |
  	└── server.js - The "go" button.


Things Surly should be able to reply to (an inconclusive list)
==============================================================

 * "What is NOUN?"


Todo
====

Proper input normalization: http://www.alicebot.org/TR/2001/WD-aiml/#section-input-normalization
