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

var stompjs = require('stompjs');
var util = require('util');
var events = require('events');

function StompJs (args) {
	var self = this;
	this.eventEmitter = new events.EventEmitter();
	this.args = args;
	createClient.call(this, args);
	/**
	 *  Automatic reconnection when disconnected
	 */
	this.eventEmitter.on('disconnected', function () {
		setTimeout(function () {
			console.log('Disconnected...');
			self.disconnect();
			createClient.call(self, self.args);
			self.connect();
		}, 2000);
	});
}

// eyeos-stomp is an EventEmitter
util.inherits(StompJs, events.EventEmitter);

function createClient (args) {
	this.client = stompjs.overTCP(args.host, args.port);
	// configure heartbeat
	this.client.heartbeat = args.heartbeat;
}

StompJs.prototype.connect = function () {
	var self = this;
	this.client.connect(this.args.login, this.args.passcode, function (data) {
		console.log("memoryUsage", util.inspect(process.memoryUsage()));
		self.eventEmitter.emit('connected', data);
	}, function (err) {
		self.eventEmitter.emit('disconnected');
	});
};

StompJs.prototype.disconnect = function () {
	this.client.disconnect();
};

StompJs.prototype.on = function (event, callback) {
	this.eventEmitter.on(event, callback);
};

StompJs.prototype.subscribe = function (headers, callback) {
	var self = this;
	this.client.subscribe(headers.destination, function (data) {
		callback(data.body, data.headers);
		self.eventEmitter.emit('message', data);
	});
};

StompJs.prototype.send = function (message, receipt) {
	if (!this.client.connected) {
		this.eventEmitter.emit('error');
		return;
	}
	if (!message.hasOwnProperty('destination')) {
		this.eventEmitter.emit('error');
		return;
	}
	this.client.send(message.destination, message, message.body);
};

StompJs.prototype.ack = function (data) {
	this.client.ack(data);
};

module.exports = StompJs;