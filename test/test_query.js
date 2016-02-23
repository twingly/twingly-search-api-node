var setup = require('./support/setup');

var expect = require('chai').expect;
var should = require('chai').should();
var nvcr = require('nock-vcr');

var Client = require('../lib/client').Client;
var Query = require('../lib/query');

describe('query', function(){
    it('creation', function(done){
        var c = new Client();
        var q = c.query();
        expect(q).to.be.instanceof(Query);
        done();
    });

    it('can\'t create query without client', function(){
        expect(function(){
            var q = new Query();
        }).to.throw('You can\'t create Query object directly');
    });

    it('with valid pattern', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        expect(q.url()).to.contain('xmloutputversion=2');
        done();
    });

    it('without valid pattern should throw error', function(){
        expect(function(){
            var c = new Client();
            var q = c.query();
            q.url();
        }).to.throw('Missing pattern');
    });

    it('with empty pattern should throw error', function(){
        expect(function(){
            var c = new Client();
            var q = c.query();
            q.pattern = '';
            q.url();
        }).to.throw('Missing pattern');
    });

    it('should add language', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        q.language = 'en';
        expect(q.requestParameters()['documentlang']).to.be.equal('en');
        done();
    });

    describe('.startTime', function(){
        context('when given time in UTC', function(){
            var startTime = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));

            it('should not change timezone', function(done){
                var c = new Client();
                var q = c.query();
                q.pattern = 'christmas';
                q.startTime = startTime;
                expect(q.requestParameters()['ts']).to.be.equal('2012-12-28 09:01:22');
                done();
            });

            it('should not modify the given date object', function(done){
                var c = new Client();
                var q = c.query();
                q.pattern = 'christmas';
                q.startTime = startTime;
                expect(q.startTime).to.be.equal(startTime);
                done();
            });
        });

        context('when given non-UTC time', function(){
            var startTime = new Date(Date.parse("2016-02-09 07:02:33 +05:00"));

            it('should convert to UTC', function(done){
                var c = new Client();
                var q = c.query();
                q.pattern = 'christmas';
                q.startTime = startTime;
                expect(q.requestParameters()['ts']).to.be.equal('2016-02-09 02:02:33');
                done();
            });

            it('should not modify the given date object', function(done){
                var c = new Client();
                var q = c.query();
                q.pattern = 'christmas';
                q.startTime = startTime;
                expect(q.startTime).to.be.equal(startTime);
                done();
            });
        });
    });

    describe('.endTime', function(){
        context('when given time in UTC', function(){
            var endTime = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));

            it('should not change timezone', function(done){
                var c = new Client();
                var q = c.query();
                q.pattern = 'christmas';
                q.endTime = endTime;
                expect(q.requestParameters()['tsTo']).to.be.equal('2012-12-28 09:01:22');
                done();
            });

            it('should not modify the given date object', function(done){
                var c = new Client();
                var q = c.query();
                q.pattern = 'christmas';
                q.endTime = endTime;
                expect(q.endTime).to.be.equal(endTime);
                done();
            });
        });

        context('when given non-UTC time', function(){
            var endTime = new Date(Date.parse("2016-02-09 07:02:33 +05:00"));

            it('should convert to UTC', function(done){
                var c = new Client();
                var q = c.query();
                q.pattern = 'christmas';
                q.endTime = endTime;
                expect(q.requestParameters()['tsTo']).to.be.equal('2016-02-09 02:02:33');
                done();
            });

            it('should not modify the given date object', function(done){
                var c = new Client();
                var q = c.query();
                q.pattern = 'christmas';
                q.endTime = endTime;
                expect(q.endTime).to.be.equal(endTime);
                done();
            });
        });
    });

    it('should encode url parameters', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        q.endTime = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));
        expect(q.urlParameters()).to.contain('tsTo=2012-12-28%2009%3A01%3A22');
        done();
    });

    it('should add searchpattern', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'spotify';
        expect(q.urlParameters()).to.contain('searchpattern=spotify');
        done();
    });

    describe('#execute()', function() {
        context('when searching for spotify', function(){
            before(function(){
                process.env['TWINGLY_SEARCH_KEY'] = 'test-key'; // used by the cassette
            });

            it('should get posts', function(done){
                nvcr.insertCassette('search_for_spotify_on_sv_blogs');
                var c = new Client();
                var q = c.query();
                q.pattern = 'spotify page-size:10';
                q.language = 'sv';
                q.execute(function(error, result){
                    nvcr.ejectCassette();
                    expect(result.posts.length).to.not.be.empty;
                    done();
                });
            });
        });
    });
});
