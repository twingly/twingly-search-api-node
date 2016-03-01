/**
 * Represents a result from a {@link Query} to the Search API
 *
 * @property {number} numberOfMatchesReturned - number of {@link Post}s the {@link Query} returned
 * @property {number} numberOfMatchesTotal - total number of {@link Post}s the {@link Query} matched
 * @property {number} secondsElapsed - number of seconds it took to execute the {@link Query}
 * @property {Array.<Post>} posts - all posts that matched the {@link Query}
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
 * If this result includes all {@link Post}s that matched the {@link Query},
 * or if there are more {@link Post}s to fetch from the API.
 *
 * @returns {boolean} true if there are more {@link Post}s to fetch from the API, false otherwise.
 */
Result.prototype.allResultsReturned = function(){
    return this.numberOfMatchesReturned == this.numberOfMatchesTotal;
};

module.exports = Result;
