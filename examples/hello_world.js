var Client = require('twingly-search-api').Client;

var client = new Client();
var query = client.query();
query.pattern = '"hello world"';
query.startTime = new Date((new Date()).setHours((new Date()).getHours() - 2));
query.execute(function(error, result){
    if (error != false) {
        console.error(error);
    } else {
        for(var i = 0; i < result.posts.length; i++) {
            console.log(result.posts[i].url);
        }
    }
});