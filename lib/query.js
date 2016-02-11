var TwinglyQueryError = require('../lib/errors').TwinglyQueryError;

var Query = function(client) {
    if (client == undefined) {
        throw new Error('You can\'t create Query object directly');
    }

    this.client = client;

    this.pattern = '';
    this.language = '';
    this.start_time = null;
    this.end_time = null;
};

Query.prototype.url = function(){
    return this.client.endpoint_url() + '?' + this.url_parameters();
};

Query.prototype.execute = function(callback){
    return this.client.execute_query(this, callback);
};

Query.prototype.url_parameters = function() {
    var params = this.request_parameters();
    var str = [];
    for (var p in params) {
        if (params.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
        }
    }
    return str.join("&");
};

Query.prototype.request_parameters = function(){
    if (this.pattern.length == 0) {
        throw new TwinglyQueryError('Missing pattern');
    }
    return {
        'key': this.client.api_key,
        'searchpattern': this.pattern,
        'documentlang': this.language,
        'ts': this._ts(),
        'tsTo': this._tsTo(),
        'xmloutputversion': 2
    }
};

Query.prototype._ts = function(){
    if(this.start_time == null) {
        return '';
    } else {
        return this.start_time.toISOString().split('.')[0].replace('T', ' ');
    }
};

Query.prototype._tsTo = function(){
    if(this.end_time == null) {
        return '';
    } else {
        return this.end_time.toISOString().split('.')[0].replace('T', ' ');
    }
};

module.exports = Query