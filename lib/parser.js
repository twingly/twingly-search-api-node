var parseString = require('xml2js').parseString;
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
    var parserOptions = {
        preserveChildrenOrder: true,
        explicitArray: false,
    };
    parseString(document, parserOptions, function (err, result) {
        if(result && result.twinglydata) {
            callback(false, createResult(result.twinglydata));
        } else if(result && result.error) {
            callback(handleFailure(result.error), null);
        } else {
            callback(handleNonXmlDocument(document), null);
        }
    });
};
/**
 * @callback Parser~parseCallback
 * @param {TwinglyError} error
 * @param {Result} result
 */
var createResult = function(dataNode){
    var result = new Result();

    result.numberOfMatchesReturned = parseInt(dataNode.$.numberOfMatchesReturned);
    result.numberOfMatchesTotal = parseInt(dataNode.$.numberOfMatchesTotal);
    result.secondsElapsed = parseFloat(dataNode.$.secondsElapsed);
    result.incomplete = dataNode.$.incompleteResult == "true";

    var posts = dataNode.post;
    if (typeof(posts) != 'undefined') {
        for(var i = 0; i < posts.length; i++) {
            result.posts.push(parsePost(posts[i]));
        }
    }

    return result;
};

var parsePost = function(postNode){
    var postParams = {'tags': [], 'links': [], 'images': []};
    var arrayTagNames = ['tags', 'links', 'images'];

    for(var propertyName in postNode) {
        var property = postNode[propertyName];
        var parsedProperty;
        switch(propertyName) {
          case 'tags':
              parsedProperty = parseArray(property.tag);
              break;
          case 'links':
              parsedProperty = parseArray(property.link);
              break;
          case 'images':
              parsedProperty = parseArray(property.image);
              break;
          case 'coordinates':
              parsedProperty = parseCoordinates(property);
              break;
          default:
              parsedProperty = property;
              break;
        }
        postParams[propertyName] = parsedProperty;
    }

    var post = new Post();
    post.setValues(postParams);
    return post;
};

var parseArray = function(property){
    // Property.link defaults to function instead of undefined
    if(typeof(property) == 'undefined' || typeof(property) == 'function') {
        return [];
    } else {
        return property;
    }
};

var parseCoordinates = function(property) {
    if(property.length == 0) {
        return {
            'latitude': null,
            'longitude': null,
        };
    }

    return {
        'latitude': parseFloat(property.latitude),
        'longitude': parseFloat(property.longitude),
    };
};

var handleFailure = function(failure){
    code = failure.$.code;
    message = failure.message;

    return (new TwinglyError()).fromApiResponse(code, message);
};

var handleNonXmlDocument = function(document){
    var response_text = "Failed to parse response: " + document.toString();
    return new TwinglyServerError(response_text);
};

module.exports = Parser;
