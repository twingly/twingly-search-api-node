var setup = require('./support/setup');

var expect = require('chai').expect;

var Parser = require('../lib/parser');

describe('post', function(){
    it('creation', function(done){
        var data = setup.getFixture('minimal_valid_result');
        (new Parser()).parse(data, function(error, result){
            var p = result.posts[0];
            expect(p.id).to.be.a('string');
            expect(p.author).to.be.a('string');
            expect(p.url).to.be.a('string');
            expect(p.title).to.be.a('string');
            expect(p.text).to.be.a('string');
            expect(p.languageCode).to.be.a('string');
            expect(p.locationCode).to.be.a('string');
            expect(p.coordinates).to.be.instanceof(Object);
            expect(p.links).to.be.instanceof(Array);
            expect(p.tags).to.be.instanceof(Array);
            expect(p.images).to.be.instanceof(Array);
            expect(p.indexedAt).to.be.instanceof(Date);
            expect(p.publishedAt).to.be.instanceof(Date);
            expect(p.reindexedAt).to.be.instanceof(Date);
            expect(p.inlinksCount).to.be.a('number');
            expect(p.blogId).to.be.a('string');
            expect(p.blogName).to.be.a('string');
            expect(p.blogUrl).to.be.a('string');
            expect(p.blogRank).to.be.a('number');
            expect(p.authority).to.be.a('number');
            done();
        });
    });

    context('deprecated properties', function(){
        it('should be equal to their non-deprecated version', function(done) {
            var data = setup.getFixture('minimal_valid_result');
            (new Parser()).parse(data, function(error, result){
                var p = result.posts[0];
                expect(p.summary).to.eq(p.text);
                expect(p.indexed).to.eq(p.indexedAt);
                expect(p.published).to.eq(p.publishedAt);
                done();
            });
        });
    });
});
