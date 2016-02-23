var setup = require('./support/setup');

var expect = require('chai').expect;

var Parser = require('../lib/parser');

describe('post', function(){
    it('creation', function(done){
        var data = setup.getFixture('minimal_valid_result');
        (new Parser()).parse(data, function(error, result){
            var p = result.posts[0];
            expect(p.url).to.be.a('string');
            expect(p.title).to.be.a('string');
            expect(p.summary).to.be.a('string');
            expect(p.languageCode).to.be.a('string');
            expect(p.published).to.be.instanceof(Date);
            expect(p.indexed).to.be.instanceof(Date);
            expect(p.blogUrl).to.be.a('string');
            expect(p.blogName).to.be.a('string');
            expect(p.authority).to.be.a('number');
            expect(p.authority).to.be.equal(1);
            expect(p.blogRank).to.be.a('number');
            expect(p.blogRank).to.be.equal(1);
            expect(p.tags).to.be.instanceof(Array);
            done();
        });
    });
});
