const BusinessError = require('./BusinessError');

class ConflictError extends BusinessError {
    constructor(message) {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

module.exports = ConflictError;
