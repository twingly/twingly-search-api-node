var TwinglyQueryError = require('./errors').TwinglyQueryError;

/**
 * Twingly Search API Query.
 * There is no need create a new instance manually, instead use {@link Client#query}.
 *
 * @property {Client} client - the client that this query is connected to
 * @property {string} searchQuery - the search query
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

    this.searchQuery = '';
    this.startTime = null;
    this.endTime = null;

    this.deprecatedLanguageProperty = '';
};

/**
 * @deprecated Please use {#searchQuery} instead
 */
Object.defineProperty(Query.prototype, 'pattern', {
    get: function pattern() {
        console.warn('[DEPRECATION] `pattern` is deprecated, use `searchQuery` instead');
        return this.searchQuery;
    },
    set: function pattern(value) {
        console.warn('[DEPRECATION] `pattern` is deprecated, use `searchQuery` instead');
        this.searchQuery = value;
    }
});

/**
 * @deprecated Please use {#searchQuery} instead
 */
Object.defineProperty(Query.prototype, 'language', {
    get: function language() {
        console.warn('[DEPRECATION] `language` is deprecated, use `searchQuery` instead');
        return this.deprecatedLanguageProperty;
    },
    set: function language(value) {
        console.warn('[DEPRECATION] `language` is deprecated, use `searchQuery` instead');
        this.deprecatedLanguageProperty = value;
    }
});

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
 * @throws {TwinglyQueryError} if {@link Query#searchQuery} is empty
 * @returns {Object.<string,string|number>}
 */
Query.prototype.requestParameters = function(){
    var fullSearchQuery = this.searchQuery;
    if(this.deprecatedLanguageProperty.length > 0) {
        fullSearchQuery += ' lang:' + this.deprecatedLanguageProperty;
    }
    if(this.startTime != null) {
        fullSearchQuery += ' start-date:' + timeToString(this.startTime);
    }
    if(this.endTime != null) {
        fullSearchQuery += ' end-date:' + timeToString(this.endTime);
    }

    if (fullSearchQuery == 0) {
        throw new TwinglyQueryError('Search query cannot be empty');
    }

    return {
        'apikey': this.client.apiKey,
        'q': fullSearchQuery,
    }
};

var timeToString = function(time){
    if(time == null) {
        return '';
    } else {
        return time.toISOString().split('.')[0];
    }
};

module.exports = Query;
