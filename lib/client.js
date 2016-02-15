var request = require('https').request;
var url = require('url');
var Post = require('./post');
var Result = require('./result');
var Query = require('./query');
var Parser = require('./parser');
var TwinglyError = require('./errors').TwinglyError;
var TwinglyAuthError = require('./errors').TwinglyAuthError;
var TwinglyQueryError = require('./errors').TwinglyQueryError;
var TwinglyServerError = require('./errors').TwinglyServerError;

/**
 * Client constructor.
 *
 * @property {string} apiKey
 * @property {string} userAgent
 *
 * @param {string} apiKey - Twingly Search API Key. If not provided, reads key from environment (TWINGLY_SEARCH_KEY)
 * @param {string} userAgent - User Agent for client
 * @returns {Client}
 * @constructor
 */
var Client = function(apiKey, userAgent) {
    if (!(this instanceof Client)) {
        return new Client(apiKey, userAgent);
    }

    this.BASE_URL = 'https://api.twingly.com';
    this.SEARCH_PATH = '/analytics/Analytics.ashx';
    this.VERSION = '1.0.0';

    this.apiKey = apiKey;
    if((this.apiKey == undefined)||(this.apiKey == null)) {
        this.apiKey = envApiKey();
    }

    if((this.apiKey == undefined)||(this.apiKey == null)) {
        apiKeyMissing();
    }

    this.userAgent = userAgent;
    if (this.userAgent == undefined) {
        this.userAgent = 'Twingly Search JavaScript Client/' + this.VERSION;
    }
};

/**
 * Returns a new {Query} object connected to this client
 *
 * @returns {Query}
 */
Client.prototype.query = function() {
    return new Query(this);
};

/**
 * Executes the given Query and returns the result
 *
 * This method should not be called manually, instead call {@link Query#execute}.
 *
 * @param {Query} query
 * @param {Client~executeQueryCallback} callback - the callback that handles the response
 */
Client.prototype.executeQuery = function(query, callback) {
    getResponse(this, query, function(error, response_body){
        (new Parser()).parse(response_body, callback);
    });
};
/**
 * @callback Client~executeQueryCallback
 * @param {TwinglyError} error
 * @param {Result} result
 */

/**
 * Returns API endpoint URL
 *
 * @returns {string}
 */
Client.prototype.endpointUrl = function() {
    return this.BASE_URL + this.SEARCH_PATH;
};

var apiKeyMissing = function() {
    throw new TwinglyAuthError('No API key has been provided.');
};

var envApiKey = function() {
    return process.env.TWINGLY_SEARCH_KEY;
};

var getResponse = function(client, query, callback) {
    var parsed_url = url.parse(query.url());
    var options = {
        hostname: parsed_url.hostname,
        port: 443,
        path: parsed_url.path,
        headers: {
            'User-Agent': client.userAgent
        }
    };
    var req = request(options, function (res) {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            if ((res.statusCode >= 200) && (res.statusCode < 300)) {
                callback(false, body);
            } else {
                callback(true, body);
            }
        });
    });
    req.on('error', function (err) {
        callback(true, err);
    });
    req.end();
};

module.exports = {
    Client: Client,
    Result: Result,
    Post: Post,
    TwinglyError: TwinglyError,
    TwinglyAuthError: TwinglyAuthError,
    TwinglyQueryError: TwinglyQueryError,
    TwinglyServerError: TwinglyServerError
};
