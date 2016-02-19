var setup = require('./support/setup');

var expect = require('chai').expect;
var nvcr = require('nock-vcr');
var url = require('url');

var Client = require('../lib/client').Client;
var Query = require('../lib/query');
var TwinglyAuthError = require('../lib/errors').TwinglyAuthError;

describe('client', function(){
    it('creation', function(){
        var c = new Client('test-key');
        expect(c.userAgent).to.be.equal('Twingly Search JavaScript Client/' + c.VERSION);
    });

    context('without api key as parameter', function(){
        it('should be read from the environment', function(){
            var c = new Client();
            expect(c.apiKey).to.be.equal(process.env.TWINGLY_SEARCH_KEY);
        });
    });

    context('with no api key at all', function(){
        before(function() {
            delete process.env['TWINGLY_SEARCH_KEY'];
        });

        after(function() {
            process.env['TWINGLY_SEARCH_KEY'] = setup.randomValueHex(16);
        });

        it('should throw error', function(){
            expect(function(){
                var c = new Client();
            }).to.throw('No API key has been provided.');
        });
    });

    context('with optional user agent given', function(){
        it('should use that user agent', function(){
            var c = new Client(null, 'Test User-Agent');
            expect(c.userAgent).to.be.equal('Test User-Agent');
        });
    });

    describe('#query', function(){
        it('should return an instance of Query', function(){
            var q = (new Client()).query();
            expect(q).to.be.instanceof(Query);
        });
    });

    describe('#execute_query', function(done){
        context('with invalid api key', function(){
            before(function() {
                process.env['TWINGLY_SEARCH_KEY'] = 'wrong';
            });

            after(function() {
                process.env['TWINGLY_SEARCH_KEY'] = setup.randomValueHex(16);
            });

            it('should throw error on invalid API key', function() {
                nvcr.insertCassette('search_without_valid_api_key');
                var c = new Client();
                var q = c.query();
                q.pattern = 'something';
                c.executeQuery(q, function(error, result){
                    nvcr.ejectCassette();
                    expect(error).to.be.instanceof(TwinglyAuthError);
                    done();
                });
            });
        });
    });

    describe('#endpoint_url', function(){
        var c = new Client();
        var expected = c.BASE_URL + c.SEARCH_PATH;

        it('should eq '+expected, function() {
            expect(c.endpointUrl()).to.be.equal(expected)
        });

        it('should be parsable', function() {
            var parts = url.parse(c.endpointUrl());
            expect(url.format(parts)).to.be.equal(expected)
        });
    });
});
