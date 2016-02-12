var Client = require('twingly-search-api').Client;
var async = require('async'); // this package is optional: npm install async

var SearchPostStream = function(keyword, language) {
    this.client = new Client(null, 'MyCompany/1.0');
    this.query = this.client.query();
    this.query.pattern = 'sort-order:asc sort:published ' + keyword
    this.query.language = language || '';
    this.query.startTime = new Date((new Date()).setHours((new Date()).getHours() - 240));
};

SearchPostStream.prototype.each = function () {
    var self = this;
    var all_results_returned = false;

    async.until(
        function(){
            return all_results_returned;
        },
        function(cb){
            self.query.execute(function(error, result){
                if(error) {
                    cb(true);
                } else {
                    all_results_returned = result.allResultsReturned();
                    for(var i = 0; i < result.posts.length; i++) {
                        console.log(result.posts[i].url);
                    }
                    self.query.startTime = result.posts[result.posts.length-1].published;
                    cb(false);
                }
            });
        }
    );
};

var stream = new SearchPostStream('(github) AND (hipchat OR slack) page-size:20')
stream.each();