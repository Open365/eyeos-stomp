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

var stomp = require('../lib/stomp');
var eyeosStomp = require('../src/eyeos-stomp');

var option = process.argv[2];

console.log('Basic connected-send stomp test');
var message = { data: "fake message" };
var queue = '/queue/test_stomp';
var headers = {
	destination: queue,
	ack: 'client',
};
var client;

function newStompConnection () {
	var stompParam = {
		port: 61613,
		host: 'localhost',
		debug: false,
		login: 'guest',
		passcode: 'guest',
	};

	if (option === 'eyeos-stomp') {
		client = new eyeosStomp(stompParam);
	} else {
		client = new stomp.Stomp(stompParam);
	}
	client.connect();
}

function start () {
	newStompConnection();

	client.on('connected', function () {
		client.subscribe(headers, function (body, headers) {
			console.log("Subscribed!", body, headers);
		});

		console.log('Send message after connected...', message);
		client.send({
			'destination': queue,
			'body': JSON.stringify(message),
			'persistent': 'true'
		}, true);
	});

	client.on('error', function (error_frame) {
		console.log(error_frame);
	});

	client.on('message', function(message) {
		//console.log("HEADERS: " + sys.inspect(message.headers));
		//console.log("BODY: " + message.body);
		console.log("Got message: " + message.headers['message-id'], message);
		client.ack(message.headers['message-id']);
	});

	client.on('disconnected', function () {
		console.log('disconnected');
		newStompConnection();
	});
}

start();
