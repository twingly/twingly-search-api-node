var Helpers = require('./helpers').Helpers;
var testHelper = new Helpers();

// Do not record new fixtures if one already exist
process.env['VCR_MODE'] = 'cache';

var path = require('path');
var sepiaVcr = require('sepia');
sepiaVcr.fixtureDir(path.join(process.cwd(), 'test', 'cassettes'));

// Fake API key for tests
process.env['TWINGLY_SEARCH_KEY'] = testHelper.randomValueHex(16);

exports.randomValueHex = testHelper.randomValueHex;
exports.getFixture = testHelper.getFixture;
