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


var stomp = require('stomp');

var num = process.argv[2];

// Set to true if you want a receipt
// of all messages sent.
var receipt = true;

// Set debug to true for more verbose output.
// login and passcode are optional (required by rabbitMQ)
var stomp_args = {
    port: 61613,
    host: 'localhost',
    debug: false,
    login: 'guest',
    passcode: 'guest',
}

var client = new stomp.Stomp(stomp_args);

var queue = '/queue/test_stomp';

client.connect();

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

client.on('connected', function() {
    num = num || 1000;
    for (var i = 0; i < num; i++) {
        client.send({
            'destination': queue,
            'body': 'Testing\n\ntesting1\n\ntesting2 ' + i,
            'persistent': 'true'
        }, receipt);
        sleep(250);
    }
    console.log('Produced ' + num + ' messages');
    client.disconnect();
});

client.on('receipt', function(receipt) {
    console.log("RECEIPT: " + receipt);
});

client.on('error', function(error_frame) {
    console.log(error_frame.body);
    client.disconnect();
});

process.on('SIGINT', function() {
    console.log('Produced ' + num + ' messages');
    client.disconnect();
    process.exit(0);
});
