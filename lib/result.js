var Result = function(){
    this.numberOfMatchesReturned = 0;
    this.secondsElapsed = 0.0;
    this.numberOfMatchesTotal = 0;
    this.posts = [];
};

Result.prototype.allResultsReturned = function(){
    return this.numberOfMatchesReturned == this.numberOfMatchesTotal;
};

module.exports = Result;