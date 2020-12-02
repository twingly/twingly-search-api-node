var Client = require('../').Client;
var async = require('async'); // this package is optional: npm install async

var SearchPostStream = function(keyword, language) {
    var languageQuery = language ? 'lang:' + language : '';
    this.client = new Client(null, 'MyCompany/1.0');
    this.query = this.client.query();
    this.query.searchQuery = 'sort-order:asc ' +
      languageQuery +
      ' sort:published ' +
      keyword;

    // 1 day ago
    this.query.startTime = new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
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
                    if(result.posts.length > 0) {
                        self.query.startTime = result.posts[result.posts.length-1].publishedAt;
                    }

                    cb(false);
                }
            });
        }
    );
};

var stream = new SearchPostStream('github OR (hipchat AND slack) page-size:20');
stream.each();
