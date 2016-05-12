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

var sinon = require('sinon');
var assert = require('chai').assert;

var EyeosStomp = require('../eyeos-stomp').Stomp;

suite("EyeosStomp Suite", function () {
    var sut;
	var args, fakeStomp, apply;

    setup(function () {
		args = "some args";
		apply = {
			apply: sinon.stub()
		};
		fakeStomp = {
			connect: sinon.stub(),
			disconnect: sinon.stub(),
			on: apply,
			subscribe: apply,
			send: apply,
			ack: apply
		};
        sut = new EyeosStomp(args, fakeStomp);
    });

	[
		'connect',
		'disconnect'
	].forEach(function (method) {
		test('#' + method + " calls to " + method, function() {
			sut[method]();
			sinon.assert.calledWith(fakeStomp[method]);
		});
	});

	[
		'on',
		'subscribe',
		'send',
		'ack'
	].forEach(function (method) {
			test('#' + method + " calls to apply", function() {
				var data = "some data";
				sut[method](data);
				sinon.assert.calledWith(fakeStomp[method].apply, fakeStomp, [ data ]);
			});
		});

});
