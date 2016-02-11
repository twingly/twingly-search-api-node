var request = require('https').request;
var url = require('url');
var Query = require('./query');
var Parser = require('./parser');
var TwinglyAuthError = require('./errors').TwinglyAuthError;

var Client = function(api_key, user_agent) {
    if (!(this instanceof Client)) {
        return new Client(api_key, user_agent);
    }

    this.BASE_URL = 'https://api.twingly.com';
    this.SEARCH_PATH = '/analytics/Analytics.ashx';
    this.VERSION = '1.0.0';

    this.api_key = api_key;
    if((this.api_key == undefined)||(this.api_key == null)) {
        this.api_key = this._env_api_key();
    }

    if((this.api_key == undefined)||(this.api_key == null)) {
        this._api_key_missing();
    }

    this.user_agent = user_agent;
    if (this.user_agent == undefined) {
        this.user_agent = 'Twingly Search JavaScript Client/' + this.VERSION;
    }
};

Client.prototype.query = function() {
    return new Query(this);
};

Client.prototype.execute_query = function(query, callback) {
    this._get_response(query, function(error, response_body){
        (new Parser()).parse(response_body, callback);
    });
};

Client.prototype.endpoint_url = function() {
    return this.BASE_URL + this.SEARCH_PATH;
};

Client.prototype._env_api_key = function() {
    return process.env.TWINGLY_SEARCH_KEY;
};

Client.prototype._get_response = function(query, callback) {
    var parsed_url = url.parse(query.url());
    var options = {
        hostname: parsed_url.hostname,
        port: 443,
        path: parsed_url.path,
        headers: {
            'User-Agent': this.user_agent
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

Client.prototype._api_key_missing = function() {
    throw new TwinglyAuthError('No API key has been provided.');
};

module.exports = Client