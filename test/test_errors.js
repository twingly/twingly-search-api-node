var expect = require('chai').expect;

var TwinglyError = require('../lib/errors').TwinglyError;
var TwinglyAuthError = require('../lib/errors').TwinglyAuthError;
var TwinglyServerError = require('../lib/errors').TwinglyServerError;

describe('errors', function(){
    it('fromApiResponseMessage', function(){
        var e = new TwinglyError();
        expect(e.fromApiResponseMessage('... API key ...')).to.be.instanceof(TwinglyAuthError);
        expect(e.fromApiResponseMessage('server error')).to.be.instanceof(TwinglyServerError);
    });
});
