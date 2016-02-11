function TwinglyError(message) {
    this.name = 'TwinglyError';
    this.message = message;
    this.stack = (new Error()).stack;
}
TwinglyError.prototype = new Error;
TwinglyError.prototype.from_api_response_message = function(message) {
    if(message.indexOf('API key') >= 0) {
        return new TwinglyAuthError(message);
    } else {
        return new TwinglyServerError(message);
    }
};

function TwinglyQueryError(message) {
    this.name = 'TwinglyQueryError';
    this.message = message;
    this.stack = (new Error()).stack;
}
TwinglyQueryError.prototype = new TwinglyError;

function TwinglyAuthError(message) {
    this.name = 'TwinglyAuthError';
    this.message = message;
    this.stack = (new Error()).stack;
}
TwinglyAuthError.prototype = new TwinglyError;

function TwinglyServerError(message) {
    this.name = 'TwinglyServerError';
    this.message = message;
    this.stack = (new Error()).stack;
}
TwinglyServerError.prototype = new TwinglyError;

module.exports = {
    TwinglyError: TwinglyError,
    TwinglyQueryError: TwinglyQueryError,
    TwinglyAuthError: TwinglyAuthError,
    TwinglyServerError: TwinglyServerError
};