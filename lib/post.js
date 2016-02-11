var Post = function(){
    this.url = '';
    this.title = '';
    this.summary = '';
    this.languageCode = '';
    this.published = new Date(Date.parse('1970-01-01T00:00:01Z'));
    this.indexed = new Date(Date.parse('1970-01-01T00:00:01Z'));
    this.blogUrl = '';
    this.blogName = '';
    this.authority = 0;
    this.blogRank = 0;
    this.tags = [];
};

Post.prototype.setValues = function(params){
    this.url = params['url'];
    this.title = params['title'];
    this.summary = params['summary'];
    this.languageCode = params['languageCode'];
    this.published = new Date(Date.parse(params['published'].replace(' ', 'T')));
    this.indexed = new Date(Date.parse(params['indexed'].replace(' ', 'T')));
    this.blogUrl = params['blogUrl'];
    this.blogName = params['blogName'];
    if(!isNaN(parseInt(params['authority']))) {
        this.authority = parseInt(params['authority']);
    } else {
        this.authority = 0;
    }
    if(!isNaN(parseInt(params['blogRank']))) {
        this.blogRank = parseInt(params['blogRank']);
    } else {
        this.blogRank = 0;
    }
    this.tags = params['tags'];
};

module.exports = Post;