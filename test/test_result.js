var setup = require('./support/setup');

var expect = require('chai').expect;

var Parser = require('../lib/parser');
var Result = require('../lib/result');

describe('Result', function(){
    it('can be constructed', function(done){
        var data = setup.getFixture('minimal_valid_result');
        (new Parser()).parse(data, function(error, result){
            expect(result.posts).to.be.instanceof(Array);
            expect(result.numberOfMatchesReturned).to.be.a('number');
            expect(result.numberOfMatchesTotal).to.be.a('number');
            expect(result.secondsElapsed).to.be.a('number');
            expect(result.allResultsReturned()).to.be.equal(false);
            expect(result.incomplete).to.be.equal(false);
            done();
        });
    });
});
