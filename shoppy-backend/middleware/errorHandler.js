const { errorResponse } = require('../utils/response');

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error(`Error encountered: ${err.message}`);
    // console.error(err.stack); // Optionally hide stack trace in production

    let statusCode = 500;
    let message = 'Internal Server Error';

    // Handle specific known errors (e.g., from Sequelize or custom service errors)
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Resource already exists (e.g., Email already registered).';
    } else if (err.message.includes('not found')) {
        statusCode = 404;
        message = err.message;
    } else if (err.message.includes('Invalid') || err.message.includes('required') || err.message.includes('stock') || err.message.includes('cannot') || err.message.includes('failed')) {
        statusCode = 400; // Bad Request for validation/logic errors
        message = err.message;
    }

    errorResponse(res, message, statusCode);
};

module.exports = errorHandler;