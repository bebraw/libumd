'use strict';
var fs = require('fs');
var path = require('path');


exports.read = function(cb, file) {
    var p = path.join(__dirname, 'data', file || 'demo.js');

    fs.readFile(p, {
        encoding: 'utf-8'
    }, function(err, data) {
        if(err) {
            return console.error(err);
        }

        cb(data);
    });
};
