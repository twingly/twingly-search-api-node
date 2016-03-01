/**
 * A blog post
 *
 * @property {string} url - the post URL
 * @property {string} title - the post title
 * @property {string} summary - the blog post text
 * @property {string} languageCode - ISO two letter language code for the language that the post was written in
 * @property {Date} published - the date when the post was published
 * @property {Date} indexed - the date when the post was indexed by Twingly
 * @property {string} blogUrl - the blog URL
 * @property {string} blogName - name of the blog
 * @property {number} authority - the blog's authority/influence {@link https://developer.twingly.com/resources/search/#authority}
 * @property {number} blogRank - the rank of the blog, based on authority and language {@link https://developer.twingly.com/resources/search/#authority}
 * @property {string[]} tags - tags
 *
 * @constructor
 */
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

/**
 * Sets all instance variables for the Post, given an object
 *
 * @param {object} params - containing blog post data
 */
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
