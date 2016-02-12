var expect = require('chai').expect;
var nvcr = require('nock-vcr');

var Client = require('../lib/client').Client;
var Query = require('../lib/query');
var TwinglyAuthError = require('../lib/errors').TwinglyAuthError;

describe('client', function(){
    beforeEach(function() {
        if((process.env['TWINGLY_SEARCH_KEY'] == undefined) || (process.env['TWINGLY_SEARCH_KEY'] == 'wrong')) {
            if(process.env['TWINGLY_SEARCH_KEY_TEMP'] != undefined) {
                process.env['TWINGLY_SEARCH_KEY'] = process.env['TWINGLY_SEARCH_KEY_TEMP'];
            } else {
                process.env['TWINGLY_SEARCH_KEY'] = 'test-key';
            }
        }
    });

    it('creation', function(){
        var c = new Client('test-key');
        expect(c.userAgent).to.be.equal('Twingly Search JavaScript Client/' + c.VERSION);
    });

    it('without api key as parameter', function(){
        var c = new Client();
        expect(c.apiKey).to.be.equal(process.env.TWINGLY_SEARCH_KEY);
    });

    it('with no api key at all', function(){
        expect(function(){
            process.env['TWINGLY_SEARCH_KEY_TEMP'] = process.env['TWINGLY_SEARCH_KEY'];
            delete process.env['TWINGLY_SEARCH_KEY'];
            var c = new Client();
        }).to.throw('No API key has been provided.');
    });

    it('with optional user agent given', function(){
        var c = new Client(null, 'Test User-Agent');
        expect(c.userAgent).to.be.equal('Test User-Agent');
    });

    it('query', function(){
        var q = (new Client()).query();
        expect(q).to.be.instanceof(Query);
    });

    it('execute query with invalid api key', function(done){
        process.env['TWINGLY_SEARCH_KEY_TEMP'] = process.env['TWINGLY_SEARCH_KEY'];
        process.env['TWINGLY_SEARCH_KEY'] = 'wrong';

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

    it('endpoint url', function(){
        var c = new Client();
        expect(c.endpointUrl()).to.be.equal(c.BASE_URL + c.SEARCH_PATH)
    });
});