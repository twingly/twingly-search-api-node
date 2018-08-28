var Helpers = require('./helpers').Helpers;
var testHelper = new Helpers();

if (typeof process.env['VCR_MODE'] === 'undefined') {
    // Do not record new fixtures if one already exists
    process.env['VCR_MODE'] = 'cache';
}

if (typeof process.env['TWINGLY_SEARCH_KEY'] === 'undefined') {
    process.env['TWINGLY_SEARCH_KEY'] = testHelper.randomValueHex(16);
}

var path = require('path');
var replayer = require('replayer');
replayer.fixtureDir(path.join(process.cwd(), 'test', 'cassettes'));

// Do not take API key into account when generating fixture filename
replayer.filter({
    url: /apikey=/,
    urlFilter: function(url) {
        return url.replace(/apikey=[^&]+/, 'a-key');
    }
});

replayer.substitute('fake-key', function() {
    return process.env['TWINGLY_SEARCH_KEY'];
});

exports.randomValueHex = testHelper.randomValueHex;
exports.getFixture = testHelper.getFixture;
