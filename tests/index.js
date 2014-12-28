'use strict';
var browser = require('./browser');
var cjs = require('./cjs');


tests();

function tests() {
    browser();
    cjs();
}

