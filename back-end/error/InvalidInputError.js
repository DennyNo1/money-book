const BusinessError = require('./BusinessError');

class InvalidInputError extends BusinessError {
    constructor(message) {
        super(message, 400);
        this.name = 'InvalidInputError';
    }
}

module.exports = InvalidInputError;