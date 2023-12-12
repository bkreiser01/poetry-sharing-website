/**
 * @fileoverview Middleware for authentication
 * @module middlewares/auth
 */
const exports = {
    /**
     * Middleware to force the user to login or register
     * 
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Function} next - Next function
     */
    forceLogin(req, res, next) {
        // TODO: Implement this middleware
        if (!req.session.user && req.originalUrl != '/login' && req.originalUrl != '/register') {
            return res.redirect('/login');
        }

        if (req.session.user && (req.originalUrl == '/login' || req.originalUrl == '/register')) {
            return res.redirect('/');
        }
        next();
    },
};

export default exports;