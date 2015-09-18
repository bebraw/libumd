'use strict';
var amd = require('./amd');
var amdWithDeps = require('./amd-with-deps');
var browser = require('./browser');
var browserWithDeps = require('./browser-with-deps');
var cjs = require('./cjs');

tests();

function tests() {
    amd();
    amdWithDeps();
    browser();
    browserWithDeps();
    cjs();
}

