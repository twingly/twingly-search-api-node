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

    it('query without client', function(){
        expect(function(){
            var q = new Query();
        }).to.throw('You can\'t create Query object directly');
    });

    it('query with valid pattern', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        expect(q.url()).to.contain('xmloutputversion=2');
        done();
    });

    it('query without valid pattern', function(){
        expect(function(){
            var c = new Client();
            var q = c.query();
            q.url();
        }).to.throw('Missing pattern');
    });

    it('query with empty pattern', function(){
        expect(function(){
            var c = new Client();
            var q = c.query();
            q.pattern = '';
            q.url();
        }).to.throw('Missing pattern');
    });

    it('query should add language', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        q.language = 'en';
        expect(q.requestParameters()['documentlang']).to.be.equal('en');
        done();
    });

    it('query should add startTime', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        q.startTime = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));
        expect(q.requestParameters()['ts']).to.be.equal('2012-12-28 09:01:22');
        done();
    });

    it('query should add endTime', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        q.endTime = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));
        expect(q.requestParameters()['tsTo']).to.be.equal('2012-12-28 09:01:22');
        done();
    });

    it('query should encode url parameters', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        q.endTime = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));
        expect(q.urlParameters()).to.contain('tsTo=2012-12-28%2009%3A01%3A22');
        done();
    });

    it('query pattern', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'spotify';
        expect(q.urlParameters()).to.contain('searchpattern=spotify');
        done();
    });

    it('query pattern network', function(done){
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
