var setup = require('./support/setup');

var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-datetime'));
chai.use(require('chai-fuzzy'));

var TwinglyAuthError = require('../lib/errors').TwinglyAuthError;
var TwinglyServerError = require('../lib/errors').TwinglyServerError;
var Parser = require('../lib/parser');
var Result = require('../lib/result');
var Post = require('../lib/post');

describe('Parser', function(){
    context('when given a minimal valid result', function(){
        var data = setup.getFixture('minimal_valid_result');
        var result;

        before(function(done) {
            (new Parser()).parse(data, function(error, _result){
                result = _result;
                done();
            });
        });

        it('should be an instance of Result', function(){
            expect(result).to.be.instanceof(Result);
        });

        it('should set the amount of matches', function() {
            expect(result.numberOfMatchesReturned).to.eq(3);
            expect(result.numberOfMatchesTotal).to.eq(3122050);
        });

        describe('the first parsed post', function() {
            var index = 0;
            var post;

            before(function(done) {
                post = result.posts[index];
                done();
            });

            it('#id', function() {
                expect(post.id).to.eq('16405819479794412880');
            });

            it('#author', function() {
                expect(post.author).to.eq('klivinihemligheten');
            });

            it('#url', function() {
                expect(post.url).to.eq('http://nouw.com/klivinihemligheten/planering---men-dalig-30016048');
            });

            it('#title', function() {
                expect(post.title).to.eq('Planering - men dålig');
            });

            it('#text', function() {
                expect(post.text).to.have.string('Det vart en förmiddag på boxen med en brud som jag lärt känna ');
            });

            it('#languageCode', function() {
                expect(post.languageCode).to.eq('sv');
            });

            it('#locationCode', function() {
                expect(post.locationCode).to.eq('se');
            });

            it('#coordinates', function() {
                expect(post.coordinates.longitude).to.equal(10.75);
                expect(post.coordinates.latitude).to.equal(49.1);
            });

            it('#links', function() {
              expect(post.links).to.be.like([]);
            });

            it('#tags', function() {
              var expectedTags = [
                "Ätas & drickas",
                "Universitet & studentlivet",
                "Träning",
                "To to list",
              ];
              expect(post.tags).to.be.like(expectedTags);
            });

            it('#images', function() {
              expect(post.images).to.be.like([]);
            });

            it('#indexedAt', function() {
              expect(post.indexedAt).to.equalTime(new Date('2017-05-04 06:51:23 UTC'));
            });

            it('#publishedAt', function() {
                expect(post.publishedAt).to.equalTime(new Date('2017-05-04 06:50:59 UTC'));
            });

            it('#reindexedAt', function() {
                expect(post.reindexedAt).to.equalTime(new Date('2017-05-04 08:51:23 UTC'));
            });

            it('#inlinksCount', function() {
                expect(post.inlinksCount).to.eq(0);
            });

            it('#blogId', function() {
                expect(post.blogId).to.eq('5312283800049632348');
            });

            it('#blogName', function() {
                expect(post.blogName).to.eq('Love life like a student');
            });

            it('#blogUrl', function() {
                expect(post.blogUrl).to.eq('http://nouw.com/klivinihemligheten');
            });

            it('#blogRank', function() {
                expect(post.blogRank).to.eq(1);
            });

            it('#authority', function() {
              expect(post.authority).to.eq(0);
            });
        });
    });

    context('when given valid empty result', function(){
        it('can parse it', function(done){
            var data = setup.getFixture('valid_empty_result');
            (new Parser()).parse(data, function(error, result){
                expect(result).to.be.instanceof(Result);
                expect(result.posts.length).to.be.equal(0);
                expect(result.numberOfMatchesTotal).to.be.equal(0);
                expect(result.numberOfMatchesReturned).to.be.equal(0);
                done();
            });
        });
    });

    context('when receiving an unauthorized response', function(){
        it('returns an error', function(done){
            var data = setup.getFixture('unauthorized_api_key_result');
            (new Parser()).parse(data, function(error, result){
                expect(error).to.be.instanceof(TwinglyAuthError);
                done();
            });
        });
    });

    context('when authentication service is unavailable', function(){
        it('returns an error', function(done){
            var data = setup.getFixture('service_unavailable_result');
            (new Parser()).parse(data, function(error, result){
                expect(error).to.be.instanceof(TwinglyServerError);
                done();
            });
        });
    });

    context('when the API responds with an internal server error', function(){
        it('returns an error', function(done){
            var data = setup.getFixture('undefined_error_result');
            (new Parser()).parse(data, function(error, result){
                expect(error).to.be.instanceof(TwinglyServerError);
                done();
            });
        });
    });

    context('when the API responds with non-XML', function(){
        it('returns an error', function(done){
            var data = setup.getFixture('non_xml_result');
            (new Parser()).parse(data, function(error, result){
                expect(error).to.be.instanceof(TwinglyServerError);
                done();
            });
        });
    });
});
