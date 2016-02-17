var expect = require('chai').expect;
var fs = require('fs');

var TwinglyAuthError = require('../lib/errors').TwinglyAuthError;
var TwinglyServerError = require('../lib/errors').TwinglyServerError;
var Parser = require('../lib/parser');
var Result = require('../lib/result');

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
