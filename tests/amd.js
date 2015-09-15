'use strict';
var fs = require('fs');
var path = require('path');
var umdify = require('../');
var utils = require('./utils');

module.exports = function() {
    var requirejsPath = path.join(__dirname, '../node_modules/requirejs/require.js');
    var requirejsCode = fs.readFileSync(requirejsPath);

    utils.read(function(data) {
        var code = requirejsCode;

        code += umdify(data, {
            amdModuleId: 'test',
            globalAlias: 'test'
        });

        code += '\nrequire([\'test\'], function(test) {test.test();})';

        utils.runInPhantom(code);
    }, 'amd.js');
}
