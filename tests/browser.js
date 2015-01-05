'use strict';
var assert = require('assert');
var stream = require('stream');

var streamSplitter = require('stream-splitter');
var smokestack = require('smokestack');

var umdify = require('../');

var read = require('./utils').read;


module.exports = function() {
    if(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
        test('chrome');
        test('firefox');
    }
    else {
        console.warn('Skipping browser tests, you should set SAUCE_USERNAME and SAUCE_ACCESS_KEY');
    }
};

function test(browser) {
    read(function(data) {
        var code = umdify(data, {
            globalAlias: 'test'
        });

        code += '\nwindow.test();';

        var s = new stream.Readable();
        s._read = function noop() {};

        s.push(code);
        s.push(null);

        var splitter = s.pipe(smokestack({
                browser: browser,
                timeout: 15000,
                saucelabs: true
            }))
            .pipe(streamSplitter('\n'));

        splitter.encoding = 'utf8';

        var executed = false;
        splitter.on('token', function(token) {
            if(token === 'executed') {
                executed = true;
            }
        });

        splitter.on('done', function() {
            assert(executed, 'Executed UMD code');
        });

        splitter.on('error', function(err) {
            console.error(err);
        });
    }, 'browser.js');
}
