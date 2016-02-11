var Result = function(){
    this.number_of_matches_returned = 0;
    this.seconds_elapsed = 0.0;
    this.number_of_matches_total = 0;
    this.posts = [];
};

Result.prototype.all_results_returned = function(){
    return this.number_of_matches_returned == this.number_of_matches_total;
};

module.exports = Result