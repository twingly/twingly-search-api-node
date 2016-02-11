var Post = function(){
    this.url = '';
    this.title = '';
    this.summary = '';
    this.language_code = '';
    this.published = new Date(Date.parse('1970-01-01T00:00:01Z'));
    this.indexed = new Date(Date.parse('1970-01-01T00:00:01Z'));
    this.blog_url = '';
    this.blog_name = '';
    this.authority = 0;
    this.blog_rank = 0;
    this.tags = [];
};

Post.prototype.set_values = function(params){
    this.url = params['url'];
    this.title = params['title'];
    this.summary = params['summary'];
    this.language_code = params['languageCode'];
    this.published = new Date(Date.parse(params['published'].replace(' ', 'T')));
    this.indexed = new Date(Date.parse(params['indexed'].replace(' ', 'T')));
    this.blog_url = params['blogUrl'];
    this.blog_name = params['blogName'];
    if(!isNaN(parseInt(params['authority']))) {
        this.authority = parseInt(params['authority']);
    } else {
        this.authority = 0;
    }
    if(!isNaN(parseInt(params['blogRank']))) {
        this.blog_rank = parseInt(params['blogRank']);
    } else {
        this.blog_rank = 0;
    }
    this.tags = params['tags'];
};

module.exports = Post