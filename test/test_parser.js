var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-datetime'));
chai.use(require('chai-fuzzy'));

var TwinglyAuthError = require('../lib/errors').TwinglyAuthError;
var TwinglyServerError = require('../lib/errors').TwinglyServerError;
var Parser = require('../lib/parser');
var Result = require('../lib/result');
var Post = require('../lib/post');

describe('parser', function(){
    context('with a minimal valid result', function(){
        var data = fs.readFileSync('./test/fixtures/minimal_valid_result.xml', {encoding: 'utf8'});
        var result;

        before(function(done) {
            (new Parser()).parse(data, function(error, _result){
                result = _result;
                done();
            });
        });

        describe('#posts[0]', function() {
            var index = 0;

            it('#url', function() {
                var post = result.posts[index];
                expect(post.url).to.eq('http://oppogner.blogg.no/1409602010_bare_m_ha.html');
            });

            it('#title', function() {
                var post = result.posts[index];
                expect(post.title).to.eq('Bare MÅ ha!');
            });

            it('#summary', function() {
                var post = result.posts[index];
                expect(post.summary).to.eq('Ja, velkommen til høsten ...');
            });

            it('#languageCode', function() {
                var post = result.posts[index];
                expect(post.languageCode).to.eq('no');
            });

            it('#published', function() {
                var post = result.posts[index];
                expect(post.published).to.equalTime(new Date('2014-09-02 06:53:26 UTC'));
            });

            it('#indexed', function() {
                var post = result.posts[index];
                expect(post.indexed).to.equalTime(new Date('2014-09-02 09:00:53 UTC'));
            });

            it('#blogUrl', function() {
                var post = result.posts[index];
                expect(post.blogUrl).to.eq('http://oppogner.blogg.no/');
            });

            it('#authority', function() {
                var post = result.posts[index];
                expect(post.authority).to.eq(1);
            });

            it('#blogRank', function() {
                var post = result.posts[index];
                expect(post.blogRank).to.eq(1);
            });

            it('#tags', function() {
                var post = result.posts[index];
                expect(post.tags).to.be.like(['Blogg']);
            });
        });

        describe('#posts[1]', function() {
            var index = 1;

            it('#url', function() {
                var post = result.posts[index];
                expect(post.url).to.eq('http://www.skvallernytt.se/hardtraning-da-galler-swedish-house-mafia');
            });

            it('#title', function() {
                var post = result.posts[index];
                expect(post.title).to.eq('Hårdträning – då gäller Swedish House Mafia');
            });

            it('#summary', function() {
                var post = result.posts[index];
                expect(post.summary).to.eq('Träning. Och Swedish House Mafia. Det verkar vara ett lyckat koncept. "Don\'t you worry child" och "Greyhound" är nämligen de två mest spelade träningslåtarna under januari 2013 på Spotify.\n\nRelaterade inlägg:\nSwedish House Mafia – ny låt!\nNy knivattack på Swedish House Mafia-konsert\nSwedish House Mafia gör succé i USA');
            });

            it('#languageCode', function() {
                var post = result.posts[index];
                expect(post.languageCode).to.eq('sv');
            });

            it('#published', function() {
                var post = result.posts[index];
                expect(post.published).to.equalTime(new Date('2013-01-29 15:21:56 UTC'));
            });

            it('#indexed', function() {
                var post = result.posts[index];
                expect(post.indexed).to.equalTime(new Date('2013-01-29 15:22:52 UTC'));
            });

            it('#blogUrl', function() {
                var post = result.posts[index];
                expect(post.blogUrl).to.eq('http://www.skvallernytt.se/');
            });

            it('#authority', function() {
                var post = result.posts[index];
                expect(post.authority).to.eq(38);
            });

            it('#blogRank', function() {
                var post = result.posts[index];
                expect(post.blogRank).to.eq(4);
            });

            it('#tags', function() {
                var post = result.posts[index];
                expect(post.tags).to.be.like(['Okategoriserat', 'Träning', 'greyhound', 'koncept', 'mafia']);
            });
        });

        describe('#posts[2]', function() {
            var index = 2;

            it('#url', function() {
                var post = result.posts[index];
                expect(post.url).to.eq('http://didriksinspesielleverden.blogg.no/1359472349_justin_bieber.html');
            });

            it('#title', function() {
                var post = result.posts[index];
                expect(post.title).to.eq('Justin Bieber');
            });

            it('#summary', function() {
                var post = result.posts[index];
                expect(post.summary).to.eq('OMG! Justin Bieber Believe acoustic albumet er nå ute på spotify. Han er helt super. Love him. Personlig liker jeg best beauty and a beat og as long as you love me, kommenter gjerne hva dere synes! <3 #sus YOLO');
            });

            it('#languageCode', function() {
                var post = result.posts[index];
                expect(post.languageCode).to.eq('no');
            });

            it('#published', function() {
                var post = result.posts[index];
                expect(post.published).to.equalTime(new Date('2013-01-29 15:12:29 UTC'));
            });

            it('#indexed', function() {
                var post = result.posts[index];
                expect(post.indexed).to.equalTime(new Date('2013-01-29 15:14:37 UTC'));
            });

            it('#blogUrl', function() {
                var post = result.posts[index];
                expect(post.blogUrl).to.eq('http://didriksinspesielleverden.blogg.no/');
            });

            it('#authority', function() {
                var post = result.posts[index];
                expect(post.authority).to.eq(0);
            });

            it('#blogRank', function() {
                var post = result.posts[index];
                expect(post.blogRank).to.eq(1);
            });

            it('#tags', function() {
                var post = result.posts[index];
                expect(post.tags).to.be.like([]);
            });
        });
    });

    it('with valid result containing non blogs', function(done){
        var data = fs.readFileSync('./test/fixtures/valid_non_blog_result.xml', {encoding: 'utf8'});
        (new Parser()).parse(data, function(error, result){
            expect(result).to.be.instanceof(Result);
            expect(result.posts.length).to.be.equal(1);
            done();
        });
    });

    it('with unauthorized apiKey result', function(done){
        var data = fs.readFileSync('./test/fixtures/unauthorized_api_key_result.xml', {encoding: 'utf8'});
        (new Parser()).parse(data, function(error, result){
            expect(error).to.be.instanceof(TwinglyAuthError);
            done();
        });
    });

    it('with service unavailable result', function(done){
        var data = fs.readFileSync('./test/fixtures/service_unavailable_result.xml', {encoding: 'utf8'});
        (new Parser()).parse(data, function(error, result){
            expect(error).to.be.instanceof(TwinglyServerError);
            done();
        });
    });

    it('with undefined error result', function(done){
        var data = fs.readFileSync('./test/fixtures/undefined_error_result.xml', {encoding: 'utf8'});
        (new Parser()).parse(data, function(error, result){
            expect(error).to.be.instanceof(TwinglyServerError);
            done();
        });
    });

    it('with non-XML error result', function(done){
        var data = fs.readFileSync('./test/fixtures/non_xml_result.xml', {encoding: 'utf8'});
        (new Parser()).parse(data, function(error, result){
            expect(error).to.be.instanceof(TwinglyServerError);
            done();
        });
    });
});
