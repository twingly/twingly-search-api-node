var expect = require('chai').expect;

var TwinglyError = require('../lib/errors').TwinglyError;
var TwinglyAuthError = require('../lib/errors').TwinglyAuthError;
var TwinglyQueryError = require('../lib/errors').TwinglyQueryError;
var TwinglyServerError = require('../lib/errors').TwinglyServerError;

describe('errors', function(){
    it('fromApiResponseMessage', function(){
        var e = new TwinglyError();
        var msg = "Error message";
        expect(e.fromApiResponse(401, msg)).to.be.instanceof(TwinglyAuthError);
        expect(e.fromApiResponse(402, msg)).to.be.instanceof(TwinglyAuthError);
        expect(e.fromApiResponse(400, msg)).to.be.instanceof(TwinglyQueryError);
        expect(e.fromApiResponse(404, msg)).to.be.instanceof(TwinglyQueryError);
        expect(e.fromApiResponse(500, msg)).to.be.instanceof(TwinglyServerError);
    });
});
