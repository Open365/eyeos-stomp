#!/usr/bin/env node
/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


var sys = require('util');
var stomp = require('stomp');

// Set debug to true for more verbose output.
// login and passcode are optional (required by rabbitMQ)
var stomp_args = {
    port: 61613,
    host: 'localhost',
    debug: false,
    login: 'guest',
    passcode: 'guest',
};

var client = new stomp.Stomp(stomp_args);

// 'activemq.prefetchSize' is optional.
// Specified number will 'fetch' that many messages
// and dump it to the client.
var headers = {
    destination: '/queue/test_stomp',
    ack: 'client',
//    'activemq.prefetchSize': '10'
};

var messages = 0;

client.connect();

function message_callback(body, headers) {
    console.log('Message Callback Fired!');
    console.log('Headers: ' + sys.inspect(headers));
    console.log('Body: ' + body);
}

client.on('connected', function() {
    client.subscribe(headers, message_callback);
    console.log('Connected');
});

client.on('message', function(message) {
    //console.log("HEADERS: " + sys.inspect(message.headers));
    //console.log("BODY: " + message.body);
    console.log("Got message: " + message.headers['message-id']);
    client.ack(message.headers['message-id']);
    messages++;
});

client.on('error', function(error_frame) {
    console.log(error_frame.body);
    client.disconnect();
});

process.on('SIGINT', function() {
    console.log('\nConsumed ' + messages + ' messages');
    client.disconnect();
});
