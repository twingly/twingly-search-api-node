var request = require('https').request;
var url = require('url');
var Query = require('./query');
var Parser = require('./parser');
var TwinglyAuthError = require('./errors').TwinglyAuthError;

var Client = function(apiKey, userAgent) {
    if (!(this instanceof Client)) {
        return new Client(apiKey, userAgent);
    }

    this.BASE_URL = 'https://api.twingly.com';
    this.SEARCH_PATH = '/analytics/Analytics.ashx';
    this.VERSION = '1.0.0';

    this.apiKey = apiKey;
    if((this.apiKey == undefined)||(this.apiKey == null)) {
        this.apiKey = this._envApiKey();
    }

    if((this.apiKey == undefined)||(this.apiKey == null)) {
        this._apiKeyMissing();
    }

    this.userAgent = userAgent;
    if (this.userAgent == undefined) {
        this.userAgent = 'Twingly Search JavaScript Client/' + this.VERSION;
    }
};

Client.prototype.query = function() {
    return new Query(this);
};

Client.prototype.executeQuery = function(query, callback) {
    this._getResponse(query, function(error, response_body){
        (new Parser()).parse(response_body, callback);
    });
};

Client.prototype.endpointUrl = function() {
    return this.BASE_URL + this.SEARCH_PATH;
};

Client.prototype._envApiKey = function() {
    return process.env.TWINGLY_SEARCH_KEY;
};

Client.prototype._getResponse = function(query, callback) {
    var parsed_url = url.parse(query.url());
    var options = {
        hostname: parsed_url.hostname,
        port: 443,
        path: parsed_url.path,
        headers: {
            'User-Agent': this.userAgent
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

Client.prototype._apiKeyMissing = function() {
    throw new TwinglyAuthError('No API key has been provided.');
};

module.exports = Client;