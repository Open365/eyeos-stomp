Eyeos Stomp Library
===================

## Overview

An eyeos library that implement the STOMP protocol. Currently uses an implementation of *benjaminws* 
BUT it is planned to change it eventually for the one implemented by *jmesnil*, that has the heartbeat feature.  

	To activate the new implementation, just change the main file 
	from "lib/stomp" to "src/eyeos-stomp" at the package.json file.


For further documentation for the stomp by *benjaminws* see http://benjaminws.github.com/stomp-js/

For further documentation for the stomp by *jmesnil* see http://jmesnil.net/stomp-websocket/doc/ 

## How to use it

	var eyeosStomp = require('eyeos-stomp');

	var client = new eyeosStomp({
		port: 61613,
		host: 'localhost',
		debug: false,
		login: <user_valid_rabbitmq>,
		passcode: <password_valid_rabbitmq>
	});

If you want the stomp to heart-beating, it is mandatory to add them at this way:

	var client = new eyeosStomp({
		heartbeat: {
			outgoing: 10000,	// miliseconds
			incoming: 10000		// miliseconds
		},
		port: 61613,
		host: 'localhost',
		debug: false,
		login: <user_valid_rabbitmq>,
		passcode: <password_valid_rabbitmq>
	});

### Examples

At the *eyeos-stomp-samples* folder there are 2 very basic samples that initially uses the 2 stomp libraries 
referenced at the overview. Also they can be executed with the parameter 'eyeos-stomp' in order to
use the eyeos-stomp entry file, the one that makes possible to use the lib with or without heartbeat 
( **there's no heartbeat by default** )

	$ node eyeos-stomp-samples/[ stomp.sample.js | stompjs.sample.js ] [ null | eyeos-stomp ] 

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ grunt test
```