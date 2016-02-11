var TwinglyQueryError = require('../lib/errors').TwinglyQueryError;

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

Query.prototype.url = function(){
    return this.client.endpointUrl() + '?' + this.urlParameters();
};

Query.prototype.execute = function(callback){
    return this.client.executeQuery(this, callback);
};

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

Query.prototype.requestParameters = function(){
    if (this.pattern.length == 0) {
        throw new TwinglyQueryError('Missing pattern');
    }
    return {
        'key': this.client.apiKey,
        'searchpattern': this.pattern,
        'documentlang': this.language,
        'ts': this._ts(),
        'tsTo': this._tsTo(),
        'xmloutputversion': 2
    }
};

Query.prototype._ts = function(){
    if(this.startTime == null) {
        return '';
    } else {
        return this.startTime.toISOString().split('.')[0].replace('T', ' ');
    }
};

Query.prototype._tsTo = function(){
    if(this.endTime == null) {
        return '';
    } else {
        return this.endTime.toISOString().split('.')[0].replace('T', ' ');
    }
};

module.exports = Query;