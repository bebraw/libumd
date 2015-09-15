'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var stream = require('stream');

var streamSplitter = require('stream-splitter');
var smokestack = require('smokestack');

var umdify = require('../');

var read = require('./utils').read;


module.exports = function() {
    test('chrome');
    test('firefox');
};

function test(browser) {
    var requirejsPath = path.join(__dirname, '../node_modules/requirejs/require.js');
    var requirejsCode = fs.readFileSync(requirejsPath);

    read(function(data) {
        var code = umdify(data, {
            amdModuleId: 'test',
            globalAlias: 'test'
        });

        code += '\nrequire([\'test\'], function(test) {test.test();})';

        var s = new stream.Readable();
        s._read = function noop() {};

        s.push(requirejsCode);
        s.push(code);
        s.push(null);

        var splitter = s.pipe(smokestack({
                browser: browser,
                timeout: 15000,
                saucelabs: false
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
    }, 'amd.js');
}
