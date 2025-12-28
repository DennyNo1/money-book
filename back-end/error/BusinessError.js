const AppError = require('./AppError');

class BusinessError extends AppError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
        this.name = 'BusinessError';
        this.isBusiness = true;
    }
}

module.exports = BusinessError;