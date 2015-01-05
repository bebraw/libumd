'use strict';
var amd = require('./amd');
var browser = require('./browser');
var cjs = require('./cjs');


tests();

function tests() {
    amd();
    browser();
    cjs();
}

