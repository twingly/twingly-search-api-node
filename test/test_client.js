var setup = require('./support/setup');

var expect = require('chai').expect;
var url = require('url');

var Client = require('../lib/client').Client;
var Query = require('../lib/query');
var TwinglyAuthError = require('../lib/errors').TwinglyAuthError;

describe('Client', function(){
    it('can be constructed', function(){
        var c = new Client('test-key');
        expect(c.userAgent).to.be.equal('Twingly Search JavaScript Client/' + c.VERSION);
    });

    context('without api key as parameter', function(){
        it('reads the key from the environment', function(){
            var c = new Client();
            expect(c.apiKey).to.be.equal(process.env.TWINGLY_SEARCH_KEY);
        });
    });

    context('when no apikey is given', function(){
        var originalApiKey;

        before(function() {
            originalApiKey = process.env['TWINGLY_SEARCH_KEY'];
            delete process.env['TWINGLY_SEARCH_KEY'];
        });

        after(function() {
            process.env['TWINGLY_SEARCH_KEY'] = originalApiKey;
        });

        it('should throw error', function(){
            expect(function(){
                var c = new Client();
            }).to.throw('No API key has been provided.');
        });
    });

    describe('#userAgent', function(){
        it('sets the given user agent', function(){
            var c = new Client(null, 'Test User-Agent');
            expect(c.userAgent).to.be.equal('Test User-Agent');
        });
    });

    describe('#query()', function(){
        it('should return an instance of Query', function(){
            var q = (new Client()).query();
            expect(q).to.be.instanceof(Query);
        });
    });

    describe('#executeQuery()', function(){
        context('with invalid api key', function(){
            var originalApiKey;

            before(function() {
                originalApiKey = process.env['TWINGLY_SEARCH_KEY'];
                process.env['TWINGLY_SEARCH_KEY'] = 'wrong';
            });

            after(function() {
                process.env['TWINGLY_SEARCH_KEY'] = originalApiKey;
            });

            it('should throw error', function(done) {
                var c = new Client();
                var q = c.query();
                q.searchQuery = 'something';
                c.executeQuery(q, function(error, result){
                    expect(error).to.be.instanceof(TwinglyAuthError);
                    done();
                });
            });
        });
    });

    describe('#endpointUrl()', function(){
        var c = new Client();
        var expected = c.BASE_URL + c.SEARCH_PATH;

        it('should eq '+expected, function() {
            expect(c.endpointUrl()).to.be.equal(expected);
        });

        it('should be parsable', function() {
            var parts = url.parse(c.endpointUrl());
            expect(url.format(parts)).to.be.equal(expected);
        });
    });
});
