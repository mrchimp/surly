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


Installation
============

1. Aquire code.
2. `npm install`
3. `bower install`
4. `grunt`


Usage
=====

There are three ways to use Surly.

1. Talk to Surly in the terminal

         node cli.js

2. Run Surly as a web server

         sudo node server.js

3. Connect Surly to an XMPP chat server

        node xmpp.js --username=surlybot@gmail.com --password=hunter2



Help
====

Run `node server.js --help` for options. Any options here can be set in a config file. See below.


Create a config file (optional)
=====================

If you're using Surly regularly, you'll probably want to set up some defaults. You can use any config format supported by [rc](https://www.npmjs.com/package/rc). For example:

1. Create a config file.

        ~/.surlyrc

2. You can set defaults for any argument. See `xmpp --help` for a list of available arguments.

        {
            "username": "surlybot@gmail.com",
            "password": "hunter2",
            "host": "talk.google.com",
            "port": "5222"
        }

3. Then just run it - no arguments!
    
        node xmpp.js


Directory Structure
===================

    |
    ├── aiml - This is where the bot's brain goes.
    |
    ├── frontend_src - Code that will be compiled into /public.
    |                  Create new frontend js/less/etc here.
    |
    ├── logs - Box of magic. Do not touch. Do not git.
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

* What is NOUN?
* NOUN is DEFINITION.


Todo
====

Proper input normalization: http://www.alicebot.org/TR/2001/WD-aiml/#section-input-normalization
