var fs = require('fs');
var crypto = require('crypto');

var Helpers = function() {};

Helpers.prototype.getFixture = function(name) {
  return fs.readFileSync('./test/fixtures/'+name+'.xml', { encoding: 'utf8' });
};

// Credits: https://blog.tompawlak.org/generate-random-values-nodejs-javascript
Helpers.prototype.randomValueHex = function(len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
};

exports.Helpers = Helpers;
