surly
=====

 > **surly** *adjective*
 > 
 >  1. bad-tempered and unfriendly

Surly is a node.js AIML interpreter.


Requirements
============

 * [Node.js](http://nodejs.org/)
 * [NPM](https://www.npmjs.org/)
 * [Grunt](http://gruntjs.com/)


Installation
============

 1. Aquire code.
 2. `npm install`
 3. `bower install`
 4. `grunt`


Usage
=====

 1. `$ sudo node server.js`
 2. Obey on-screen instructions.


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
    ├── bower.json - Manages frontend dependencies which are 
    |                installed using Bower.
    |
    ├── package.json - Manages server-side (node/npm) dependencies.
    |
  	└── server.js - The "go" button.
