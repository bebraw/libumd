'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var localeval = require('localeval');

var umdify = require('../');


module.exports = function() {
    triggered({});
    triggered();
    noCode();
};

function triggered(options) {
    read(function(data) {
        var code = umdify(data, options);

        var triggered;
        localeval(code, {
            trigger: function() {
                triggered = true;
            }
        });

        assert(triggered);
    });
}

function noCode() {
    assert.throws(function() {
        var umd = umdify();
    }, function(err) {
        if(err instanceof Error) {
            return true;
        }
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
