#!/usr/bin/env node
var testing = require('coverage_testing');
var path = require('path');

var rootPath = path.resolve(__dirname, '..');
var testPath = path.resolve(rootPath, 'tests');

testing.run(testPath);
