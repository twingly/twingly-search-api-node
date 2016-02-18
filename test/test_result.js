var expect = require('chai').expect;
var fs = require('fs');

var Parser = require('../lib/parser');
var Result = require('../lib/result');

describe('result', function(){
    it('creation', function(done){
        var data = fs.readFileSync('./test/fixtures/valid_result.xml', {encoding: 'utf8'});
        (new Parser()).parse(data, function(error, result){
            expect(result.posts).to.be.instanceof(Array);
            expect(result.numberOfMatchesReturned).to.be.a('number');
            expect(result.numberOfMatchesTotal).to.be.a('number');
            expect(result.secondsElapsed).to.be.a('number');
            expect(result.allResultsReturned()).to.be.equal(false);
            done();
        });
    });
});
