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

// ## frame
//
// The `Frame` module provides an object representation of a `Stomp` frame.
//
// ### frame.Frame
//
// An instance of the `Frame` object.
//
//     var frame = new frame.Frame();
//
// ### frame.Frame.build_frame()
//
// Build a frame object from an object of arguments.
//
//     var args = {
//         command: '',
//         headers: {},
//         body: ''
//     };
//
//     this_frame = frame.build_frame(args);
//


//
// ## Frame - Object representation of a STOMP frame
//
function Frame() {
    this.command = null;
    this.headers = null;
    this.body = null;
};

//
// ## Frame.build_frame(args, want_receipt)
//
// **Build frame based on arguments provided**
//
// Takes arguments object needed to build frame (command, headers, body?)
//
// Takes boolean to indicate that you wish to get a receipt (set receipt header)
//
// Returns an object representing a frame
//
Frame.prototype.build_frame = function(args, want_receipt) {
    var receipt_stamp = null;

    this.command = args['command'];
    this.headers = args['headers'];
    this.body = args['body'];

    if (want_receipt) {
        var _receipt = '';
        receipt_stamp = Math.floor(Math.random()*99999999999).toString();
        if (this.headers['session'] != undefined) {
            _receipt = receipt_stamp + "-" + this.headers['session'];
        }
        else {
            _receipt = receipt_stamp;
        }
        this.headers['receipt'] = _receipt;
    }
    return this;
};

//
// ## Frame.as_string()
//
// **String representation of Frame object**
//
// Returns `Frame` as string
//
Frame.prototype.as_string = function() {
    var header_strs = [],
        frame = "",
        command = this.command,
        headers = this.headers,
        body = this.body;

    for (var header in headers) {
        if (headers.hasOwnProperty(header)) {
            header_strs.push(header + ':' + headers[header]);
        }
    }

    frame += command + "\n";
    frame += header_strs.join("\n");
    frame += "\n\n";

    if(body) {
        frame += body;
    }

    frame += '\x00';

    return frame;
};

module.exports.Frame = Frame;
