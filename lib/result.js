/**
 * Represents a result from a Query to the Search API
 *
 * @property {number} numberOfMatchesReturned - number of posts the query returned
 * @property {number} secondsElapsed - number of seconds it took to execute the query
 * @property {number} numberOfMatchesTotal - number of posts the query matched
 * @property {Array.<Post>} posts - all posts that matched the query
 *
 * @constructor
 */
var Result = function(){
    this.numberOfMatchesReturned = 0;
    this.secondsElapsed = 0.0;
    this.numberOfMatchesTotal = 0;
    this.posts = [];
};

/**
 * Returns TRUE if this result includes all Posts that matched the query
 *
 * @returns {boolean}
 */
Result.prototype.allResultsReturned = function(){
    return this.numberOfMatchesReturned == this.numberOfMatchesTotal;
};

module.exports = Result;
