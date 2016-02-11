var expect = require('chai').expect;
var fs = require('fs');
var should = require('chai').should();
var nvcr = require('nock-vcr');

var Client = require('../lib/client');
var TwinglyError = require('../lib/errors').TwinglyError;
var TwinglyAuthError = require('../lib/errors').TwinglyAuthError;
var TwinglyServerError = require('../lib/errors').TwinglyServerError;
var TwinglyQueryError = require('../lib/errors').TwinglyQueryError;
var Parser = require('../lib/parser');
var Post = require('../lib/post');
var Query = require('../lib/query');
var Result = require('../lib/result');

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
        expect(c.user_agent).to.be.equal('Twingly Search JavaScript Client/' + c.VERSION);
    });

    it('without api key as parameter', function(){
        var c = new Client();
        expect(c.api_key).to.be.equal(process.env.TWINGLY_SEARCH_KEY);
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
        expect(c.user_agent).to.be.equal('Test User-Agent');
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
        c.execute_query(q, function(error, result){
            nvcr.ejectCassette();
            expect(error).to.be.instanceof(TwinglyAuthError);
            done();
        });
    });

    it('endpoint url', function(){
        var c = new Client();
        expect(c.endpoint_url()).to.be.equal(c.BASE_URL + c.SEARCH_PATH)
    });
});

describe('errors', function(){
    it('from_api_response_message', function(){
        var e = new TwinglyError();
        expect(e.from_api_response_message('... API key ...')).to.be.instanceof(TwinglyAuthError);
        expect(e.from_api_response_message('server error')).to.be.instanceof(TwinglyServerError);
    });
});

describe('parser', function(){
    it('with valid result', function(done){
        var data = fs.readFileSync('./test/fixtures/valid_result.xml', {encoding: 'utf8'});
        (new Parser()).parse(data, function(error, result){
            expect(result).to.be.instanceof(Result);
            done();
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

    it('with unauthorized api_key result', function(done){
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

describe('post', function(){
    it('creation', function(done){
        var data = fs.readFileSync('./test/fixtures/valid_result.xml', {encoding: 'utf8'});
        (new Parser()).parse(data, function(error, result){
            var p = result.posts[0];
            expect(p.url).to.be.a('string');
            expect(p.title).to.be.a('string');
            expect(p.summary).to.be.a('string');
            expect(p.language_code).to.be.a('string');
            expect(p.published).to.be.instanceof(Date);
            expect(p.indexed).to.be.instanceof(Date);
            expect(p.blog_url).to.be.a('string');
            expect(p.blog_name).to.be.a('string');
            expect(p.authority).to.be.a('number');
            expect(p.authority).to.be.equal(1);
            expect(p.blog_rank).to.be.a('number');
            expect(p.blog_rank).to.be.equal(2);
            expect(p.tags).to.be.instanceof(Array);
            done();
        });
    });
});

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
        expect(q.request_parameters()['documentlang']).to.be.equal('en');
        done();
    });

    it('query should add start_time', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        q.start_time = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));
        expect(q.request_parameters()['ts']).to.be.equal('2012-12-28 09:01:22');
        done();
    });

    it('query should add end_time', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        q.end_time = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));
        expect(q.request_parameters()['tsTo']).to.be.equal('2012-12-28 09:01:22');
        done();
    });

    it('query should encode url parameters', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'christmas';
        q.end_time = new Date(Date.UTC(2012, 11, 28, 9, 1, 22));
        expect(q.url_parameters()).to.contain('tsTo=2012-12-28%2009%3A01%3A22');
        done();
    });

    it('query pattern', function(done){
        var c = new Client();
        var q = c.query();
        q.pattern = 'spotify';
        expect(q.url_parameters()).to.contain('searchpattern=spotify');
        done();
    });

    it('query pattern', function(done){
        nvcr.insertCassette('search_for_spotify_on_sv_blogs');
        var c = new Client();
        var q = c.query();
        q.pattern = 'spotify page-size:10';
        q.language = 'sv';
        q.execute(function(error, result){
            nvcr.ejectCassette();
            expect(result.posts.length).to.be.at.least(0);
            done();
        });
    });

    /*
     it('', function(){});

     def test_query_when_searching_for_spotify(self):
     with Betamax(self._client._session).use_cassette(''):
     q = self._client.query()
     q.pattern = "spotify page-size:10"
     q.language = "sv"
     r = q.execute()
     self.assertGreater(len(r.posts), 0)
     */
});

describe('result', function(){
    it('creation', function(done){
        var data = fs.readFileSync('./test/fixtures/valid_result.xml', {encoding: 'utf8'});
        (new Parser()).parse(data, function(error, result){
            expect(result.posts).to.be.instanceof(Array);
            expect(result.number_of_matches_returned).to.be.a('number');
            expect(result.number_of_matches_total).to.be.a('number');
            expect(result.seconds_elapsed).to.be.a('number');
            expect(result.all_results_returned()).to.be.equal(false);
            done();
        });
    });
});