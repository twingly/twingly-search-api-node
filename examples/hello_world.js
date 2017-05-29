var Client = require('../').Client;

var client = new Client();
var query = client.query();
query.searchQuery = 'Hi! page-size:10';
query.startTime = new Date((new Date()).setHours((new Date()).getHours() - 24));
query.execute(function(error, result){
    if (error != false) {
        console.error(error);
    } else {
        for(var i = 0; i < result.posts.length; i++) {
            var post = result.posts[i];

            console.log(post.publishedAt + ' ' + post.url);
        }
    }
});
