var setup = require('./support/setup');

var expect = require('chai').expect;
var should = require('chai').should();

var Client = require('../lib/client').Client;
var Query = require('../lib/query');

describe('Query', function(){
    it('can be constructed', function(done){
        var c = new Client();
        var q = c.query();
        expect(q).to.be.instanceof(Query);
        done();
    });

    context('without being instantiated by a Client object', function(){
        it('throws an error', function(){
            expect(function(){
                var q = new Query();
            }).to.throw('You can\'t create Query object directly');
        });
    });

    context('without having any search conditions set', function(){
        it('throws an error', function(){
            expect(function(){
                var c = new Client();
                var q = c.query();
                q.url();
            }).to.throw('Search query cannot be empty');
        });
    });

    context('when given an empty search query', function(){
        it('throws an error', function(){
            expect(function(){
                var c = new Client();
                var q = c.query();
                q.searchQuery = '';
                q.url();
            }).to.throw('Search query cannot be empty');
        });
    });

    describe('#startTime', function(){
        context('when given time in UTC', function(){
            var startTime = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));

            it('should not change timezone', function(done){
                var c = new Client();
                var q = c.query();
                q.searchQuery = 'christmas';
                q.startTime = startTime;
                expect(q.requestParameters()['q']).to.contain('start-date:2012-12-28T09:01:22');
                done();
            });
        });

        context('when given non-UTC time', function(){
            var startTime = new Date(Date.parse("2016-02-09 07:02:33 +05:00"));

            it('should convert to UTC', function(done){
                var c = new Client();
                var q = c.query();
                q.searchQuery = 'christmas';
                q.startTime = startTime;
                expect(q.requestParameters()['q']).to.contain('start-date:2016-02-09T02:02:33');
                done();
            });
        });
    });

    describe('#endTime', function(){
        context('when given time in UTC', function(){
            var endTime = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));

            it('should not change timezone', function(done){
                var c = new Client();
                var q = c.query();
                q.searchQuery = 'christmas';
                q.endTime = endTime;
                expect(q.requestParameters()['q']).to.contain('end-date:2012-12-28T09:01:22');
                done();
            });
        });

        context('when given non-UTC time', function(){
            var endTime = new Date(Date.parse("2016-02-09 07:02:33 +05:00"));

            it('should convert to UTC', function(done){
                var c = new Client();
                var q = c.query();
                q.searchQuery = 'christmas';
                q.endTime = endTime;
                expect(q.requestParameters()['q']).to.contain('end-date:2016-02-09T02:02:33');
                done();
            });
        });
    });

    it('should encode url parameters', function(done){
        var c = new Client();
        var q = c.query();
        q.searchQuery = 'christmas';
        q.endTime = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));
        expect(q.urlParameters()).to.contain('end-date%3A2012-12-28T09%3A01%3A22');
        done();
    });

    it('should add search query', function(done){
        var c = new Client();
        var q = c.query();
        q.searchQuery = 'spotify';
        expect(q.urlParameters()).to.contain('q=spotify');
        done();
    });

    describe('#execute()', function() {
        context('when searching for spotify', function(){
            it('should get posts', function(done){
                var c = new Client();
                var q = c.query();
                q.searchQuery = 'spotify page-size:10 lang:sv';
                q.execute(function(error, result){
                    expect(result.posts.length).to.eq(10);
                    done();
                });
            });
        });
    });

    describe('#pattern', function() {
        it('should assign the pattern to SearchQuery', function(done){
            var c = new Client();
            var q = c.query();
            q.pattern = 'christmas';
            expect(q.searchQuery).to.eq('christmas');
            done();
        });
    });

    describe('#language', function() {
        it('should add language to SearchQuery', function(done){
            var c = new Client();
            var q = c.query();
            q.language = 'en';
            expect(q.requestParameters()['q']).to.contain('lang:en');
            done();
        });
    });
});
