var Helpers = require('./helpers').Helpers;
var testHelper = new Helpers();

// Do not record new fixtures if one already exists
process.env['VCR_MODE'] = 'cache';

var path = require('path');
var sepiaVcr = require('sepia');
sepiaVcr.fixtureDir(path.join(process.cwd(), 'test', 'cassettes'));
sepiaVcr.filter({
  url: /apikey=/,
  urlFilter: function(url) {
    return url.replace(/apikey=[^&]+/, 'a-key');
  }
});

if (typeof process.env['TWINGLY_SEARCH_KEY'] === 'undefined') {
    process.env['TWINGLY_SEARCH_KEY'] = testHelper.randomValueHex(16);
}

exports.randomValueHex = testHelper.randomValueHex;
exports.getFixture = testHelper.getFixture;
