/**
 * @fileoverview Middleware for authentication
 * @module middlewares/auth
 */
const exports = {
    /**
     * Middleware to check if the user is logged in
     * 
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Function} next - Next function
     */
    loginCheck(req, res, next) {
        // TODO: Implement this middleware

        next();
    },
    
};

export default exports;