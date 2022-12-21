/**
 * A blog post
 *
 * @property {string} id - the post ID (Twingly internal identification)
 * @property {string} author - the author of the blog post
 * @property {string} url - the post URL
 * @property {string} title - the post title
 * @property {string} text - the blog post text
 * @property {string} languageCode - ISO two letter language code for the language that the post was written in
 * @property {string} locationCode - ISO two letter country code for the location of the blog
 * @property {Object.<string, number>} coordinates - an object containing latitude and longitude from the post RSS
 * @property {string[]} links - all links from the blog post to other resources
 * @property {string[]} tags - the post tags/categories
 * @property {string[]} images - image URLs from the post (currently not populated)
 * @property {Date} indexedAt - the time, in UTC, when the post was indexed by Twingly
 * @property {Date} publishedAt - the time, in UTC, when the post was published
 * @property {Date} reindexedAt - timestamp when the post last was changed in our database/index
 * @property {string} inlinksCount - number of links to this post that was found in other blog posts
 * @property {string} blogId - the blog ID (Twingly internal identification)
 * @property {string} blogName - the name of the blog
 * @property {string} blogUrl - the blog URL
 * @property {number} blogRank - the rank of the blog, based on authority and language. {@link https://app.twingly.com/blog_search?tab=documentation}
 * @property {number} authority - the blog's authority/influence. {@link https://app.twingly.com/blog_search?tab=documentation}
 *
 * @constructor
 */

var Post = function(){
    this.id = '';
    this.author = '';
    this.url = '';
    this.title = '';
    this.text = '';
    this.languageCode = '';
    this.locationCode = '';
    this.coordinates = {};
    this.links = [];
    this.tags = [];
    this.images = [];
    this.indexedAt = new Date(Date.parse('1970-01-01T00:00:01Z'));
    this.publishedAt = new Date(Date.parse('1970-01-01T00:00:01Z'));
    this.reindexedAt = new Date(Date.parse('1970-01-01T00:00:01Z'));
    this.inlinksCount = 0;
    this.blogId = '';
    this.blogName = '';
    this.blogUrl = '';
    this.blogRank = 0;
    this.authority = 0;
};

/**
 * Sets all instance variables for the Post, given an object
 *
 * @param {object} params - containing blog post data
 */
Post.prototype.setValues = function(params){
    this.id = params['id'];
    this.author = params['author'];
    this.url = params['url'];
    this.title = params['title'];
    this.text = params['text'];
    this.languageCode = params['languageCode'];
    this.locationCode = params['locationCode'];
    this.coordinates = params['coordinates'];
    this.links = params['links'];
    this.tags = params['tags'];
    this.images = params['images'];
    this.indexedAt = new Date(Date.parse(params['indexedAt'].replace(' ', 'T')));
    this.publishedAt = new Date(Date.parse(params['publishedAt'].replace(' ', 'T')));
    this.reindexedAt = new Date(Date.parse(params['reindexedAt'].replace(' ', 'T')));
    if(!isNaN(parseInt(params['inlinksCount']))) {
        this.inlinksCount = parseInt(params['inlinksCount']);
    } else {
        this.inlinksCount = 0;
    }
    this.blogId = params['blogId'];
    this.blogName = params['blogName'];
    this.blogUrl = params['blogUrl'];
    if(!isNaN(parseInt(params['blogRank']))) {
        this.blogRank = parseInt(params['blogRank']);
    } else {
        this.blogRank = 0;
    }
    if(!isNaN(parseInt(params['authority']))) {
        this.authority = parseInt(params['authority']);
    } else {
        this.authority = 0;
    }
};

/**
 * @deprecated Please use {#text} instead
 */
Object.defineProperty(Post.prototype, 'summary', {
    get: function summary() {
        console.warn('[DEPRECATION] `summary` is deprecated, use `text` instead');
        return this.text;
    }
});

/**
 * @deprecated Please use {#indexedAt} instead
 */
Object.defineProperty(Post.prototype, 'indexed', {
    get: function indexed() {
        console.warn('[DEPRECATION] `indexed` is deprecated, use `indexedAt` instead');
        return this.indexedAt;
    }
});

/**
 * @deprecated Please use {#publishedAt} instead
 */
Object.defineProperty(Post.prototype, 'published', {
    get: function published() {
        console.warn('[DEPRECATION] `published` is deprecated, use `publishedAt` instead');
        return this.publishedAt;
    }
});

module.exports = Post;
