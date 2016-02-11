var util = require('util');

function TwinglyError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'TwinglyError';
    this.message = message;
    this.fromApiResponseMessage = function(message) {
        if(message.indexOf('API key') >= 0) {
            return new TwinglyAuthError(message);
        } else {
            return new TwinglyServerError(message);
        }
    };
}
util.inherits(TwinglyError, Error);

function TwinglyQueryError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'TwinglyQueryError';
    this.message = message;
}
util.inherits(TwinglyQueryError, TwinglyError);

function TwinglyAuthError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'TwinglyAuthError';
    this.message = message;
}
util.inherits(TwinglyAuthError, TwinglyError);

function TwinglyServerError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'TwinglyServerError';
    this.message = message;
}
util.inherits(TwinglyServerError, TwinglyError);

module.exports = {
    TwinglyError: TwinglyError,
    TwinglyQueryError: TwinglyQueryError,
    TwinglyAuthError: TwinglyAuthError,
    TwinglyServerError: TwinglyServerError
};