var xpath = require('xpath'), dom = require('xmldom').DOMParser;
var Result = require('./result');
var Post = require('./post');
var TwinglyError = require('./errors').TwinglyError;
var TwinglyServerError = require('./errors').TwinglyServerError;

var Parser = function() {};

Parser.prototype.parse = function(document, callback){
    var doc = new dom().parseFromString(document);

    if(xpath.select("//*[local-name(.)='operationResult' and namespace-uri(.)='http://www.twingly.com'][@resultType='failure']", doc).length > 0) {
        callback(this._handle_failure(xpath.select("//*[local-name(.)='operationResult' and namespace-uri(.)='http://www.twingly.com'][@resultType='failure']/text()", doc)[0].toString()), null);
    } else if(xpath.select("//twinglydata", doc).length == 0) {
        callback(this._handle_non_xml_document(doc), null);
    } else {
        callback(false, this._create_result(doc));
    }
};
Parser.prototype._create_result = function(data_node){
    var result = new Result();

    result.number_of_matches_returned = parseInt(data_node.documentElement.getAttribute('numberOfMatchesReturned'));
    result.number_of_matches_total = parseInt(data_node.documentElement.getAttribute('numberOfMatchesTotal'));
    result.seconds_elapsed = parseFloat(data_node.documentElement.getAttribute('secondsElapsed'));

    var posts =  xpath.select('//post[@contentType="blog"]', data_node);
    for(var i = 0; i < posts.length; i++) {
        result.posts.push(this._parse_post(posts[i]));
    }

    return result;
};

Parser.prototype._parse_post = function(element){
    var post_params = {'tags': []};
    for(var i = 0; i < element.childNodes.length; i++) {
        if((element.childNodes[i].tagName != '')&&(element.childNodes[i].tagName != undefined)) {
            if(element.childNodes[i].tagName == 'tags') {
                post_params[element.childNodes[i].tagName] = this._parse_tags(element.childNodes[i]);
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
    post.set_values(post_params);
    return post;
};

Parser.prototype._parse_tags = function(element){
    var tags = [];
    var nodes = xpath.select('//tag/text()', element);
    for(var i = 0; i < nodes.length; i++) {
        tags.push(nodes[i].nodeValue);
    }
    return tags;
};

Parser.prototype._handle_failure = function(failure){
    return (new TwinglyError()).from_api_response_message(failure);
};

Parser.prototype._handle_non_xml_document = function(document){
    var response_text = xpath.select('//text()', document)[0].toString();
    return new TwinglyServerError(response_text);
};

module.exports = Parser;