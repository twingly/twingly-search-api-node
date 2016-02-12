var TwinglyQueryError = require('./errors').TwinglyQueryError;

/**
 * Twingly Search API Query
 *
 * @property {Client} client - the client that this query is connected to
 * @property {string} patterns - the search query
 * @property {string} language - language to restrict the query to
 * @property {Date} startTime - search for posts published after this time (inclusive)
 * @property {Date} endTime - search for posts published before this time (inclusive)
 *
 * @param {Client} client
 * @constructor
 */
var Query = function(client) {
    if (client == undefined) {
        throw new Error('You can\'t create Query object directly');
    }

    this.client = client;

    this.pattern = '';
    this.language = '';
    this.startTime = null;
    this.endTime = null;
};

/**
 * Returns the request url for the query
 *
 * @returns {string}
 */
Query.prototype.url = function(){
    return this.client.endpointUrl() + '?' + this.urlParameters();
};

/**
 * Executes the query and returns the result
 *
 * @param {Query~executeCallback} callback
 */
Query.prototype.execute = function(callback){
    this.client.executeQuery(this, callback);
};
/**
 * @callback Query~executeCallback
 * @param {TwinglyError} error
 * @param {Result} result
 */

/**
 * Returns the query part of the request url
 *
 * @returns {string}
 */
Query.prototype.urlParameters = function() {
    var params = this.requestParameters();
    var str = [];
    for (var p in params) {
        if (params.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
        }
    }
    return str.join("&");
};

/**
 * Returns object of the request parameters
 *
 * @returns {{key: string, searchpattern: string, documentlang: string, ts: string, tsTo: string, xmloutputversion: number}}
 */
Query.prototype.requestParameters = function(){
    if (this.pattern.length == 0) {
        throw new TwinglyQueryError('Missing pattern');
    }
    return {
        'key': this.client.apiKey,
        'searchpattern': this.pattern,
        'documentlang': this.language,
        'ts': _timeToString(this.startTime),
        'tsTo': _timeToString(this.endTime),
        'xmloutputversion': 2
    }
};

var _timeToString = function(time){
    if(time == null) {
        return '';
    } else {
        return time.toISOString().split('.')[0].replace('T', ' ');
    }
};

module.exports = Query;