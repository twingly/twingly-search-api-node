var util = require('util');

/**
 * Twingly error base class
 *
 * @property {string} name - error name
 * @property {string} message - error message
 * @property {string} stack - error stack
 *
 * @param message
 * @constructor
 */
function TwinglyError(message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'TwinglyError';
    this.message = message;
    this.fromApiResponse = function(code, message) {
        var codeStr = code.toString();
        var fullMessage = message + " (code:" + code + ")";

        if(codeStr.indexOf('400') == 0 || codeStr.indexOf('404') == 0) {
            return new TwinglyQueryError(fullMessage);
        } else if(codeStr.indexOf('401') == 0 || codeStr.indexOf('402') == 0) {
            return new TwinglyAuthError(fullMessage);
        } else {
            return new TwinglyServerError(fullMessage);
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
