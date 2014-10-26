'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var localeval = require('localeval');

var UMD = require('../');


module.exports = function() {
    triggered({});
    triggered();
};

function triggered(options) {
    read(function(data) {
        var umd = new UMD(data, options);
        var code = umd.generate();

        var triggered;
        localeval(code, {
            trigger: function() {
                triggered = true;
            }
        });

        assert(triggered);
    });
}

function read(cb) {
    var p = path.join(__dirname, 'data', 'demo.js');

    fs.readFile(p, {
        encoding: 'utf-8'
    }, function(err, data) {
        if(err) {
            return console.error(err);
        }

        cb(data);
    });
}
