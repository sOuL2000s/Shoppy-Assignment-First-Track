/**
 * Standardized API Response utilities
 */
const successResponse = (res, data, message = 'Operation successful', status = 200) => {
    res.status(status).json({
        success: true,
        message,
        data,
    });
};

const errorResponse = (res, message = 'An unexpected error occurred', status = 500) => {
    res.status(status).json({
        success: false,
        message,
        data: null,
    });
};

module.exports = { successResponse, errorResponse };