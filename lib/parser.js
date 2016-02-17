var xpath = require('xpath'), dom = require('xmldom').DOMParser;
var Result = require('./result');
var Post = require('./post');
var TwinglyError = require('./errors').TwinglyError;
var TwinglyServerError = require('./errors').TwinglyServerError;

var Parser = function() {};

/**
 * Parse an API response body.
 *
 * @param {string} document - containing an API response XML text
 * @param {Parser~parseCallback} callback
 */
Parser.prototype.parse = function(document, callback){
    var doc = new dom().parseFromString(document);

    if(xpath.select("//*[local-name(.)='operationResult' and namespace-uri(.)='http://www.twingly.com'][@resultType='failure']", doc).length > 0) {
        callback(handleFailure(xpath.select("//*[local-name(.)='operationResult' and namespace-uri(.)='http://www.twingly.com'][@resultType='failure']/text()", doc)[0].toString()), null);
    } else if(xpath.select("//twinglydata", doc).length == 0) {
        callback(handleNonXmlDocument(doc), null);
    } else {
        callback(false, createResult(doc));
    }
};
/**
 * @callback Parser~parseCallback
 * @param {TwinglyError} error
 * @param {Result} result
 */

var createResult = function(data_node){
    var result = new Result();

    result.numberOfMatchesReturned = parseInt(data_node.documentElement.getAttribute('numberOfMatchesReturned'));
    result.numberOfMatchesTotal = parseInt(data_node.documentElement.getAttribute('numberOfMatchesTotal'));
    result.secondsElapsed = parseFloat(data_node.documentElement.getAttribute('secondsElapsed'));

    var posts =  xpath.select('//post[@contentType="blog"]', data_node);
    for(var i = 0; i < posts.length; i++) {
        result.posts.push(parsePost(posts[i]));
    }

    return result;
};

var parsePost = function(element){
    var post_params = {'tags': []};
    for(var i = 0; i < element.childNodes.length; i++) {
        if((element.childNodes[i].tagName != '')&&(element.childNodes[i].tagName != undefined)) {
            if(element.childNodes[i].tagName == 'tags') {
                post_params[element.childNodes[i].tagName] = parseTags(element.childNodes[i]);
            } else {
                if(element.childNodes[i].childNodes[0] != undefined) {
                    post_params[element.childNodes[i].tagName] = element.childNodes[i].childNodes[0].nodeValue;
                } else {
                    post_params[element.childNodes[i].tagName] = '';
                }
            }
        }
    }
    var post = new Post();
    post.setValues(post_params);
    return post;
};

var parseTags = function(element){
    var tags = [];
    var nodes = xpath.select('//tag/text()', element);
    for(var i = 0; i < nodes.length; i++) {
        tags.push(nodes[i].nodeValue);
    }
    return tags;
};

var handleFailure = function(failure){
    return (new TwinglyError()).fromApiResponseMessage(failure);
};

var handleNonXmlDocument = function(document){
    var response_text = xpath.select('//text()', document)[0].toString();
    return new TwinglyServerError(response_text);
};

module.exports = Parser;
