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

var stompFactory = require('./lib/stomp-factory');

function Stomp (args, client) {
	this.client = client || stompFactory(args);
}

Stomp.prototype.connect = function () {
	this.client.connect();
};

Stomp.prototype.disconnect = function () {
	this.client.disconnect();
};

Stomp.prototype.on = function () {
	this.client.on.apply(this.client, Array.prototype.slice.call(arguments));
};

Stomp.prototype.subscribe = function () {
	this.client.subscribe.apply(this.client, Array.prototype.slice.call(arguments));
};

Stomp.prototype.send = function () {
	this.client.send.apply(this.client, Array.prototype.slice.call(arguments));
};

Stomp.prototype.ack = function () {
	this.client.ack.apply(this.client, Array.prototype.slice.call(arguments));
};

module.exports.Stomp = Stomp;