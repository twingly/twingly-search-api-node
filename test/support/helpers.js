var fs = require('fs');

var Helpers = function() {};

Helpers.prototype.getFixture = function(name) {
  return fs.readFileSync('./test/fixtures/'+name+'.xml', { encoding: 'utf8' });
};

exports.Helpers = Helpers;
