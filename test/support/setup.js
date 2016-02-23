var Helpers = require('./helpers').Helpers;
var testHelper = new Helpers();

// Fake API key for tests
process.env['TWINGLY_SEARCH_KEY'] = testHelper.randomValueHex(16);

exports.randomValueHex = testHelper.randomValueHex;
exports.getFixture = testHelper.getFixture;
