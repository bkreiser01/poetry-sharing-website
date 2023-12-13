/**
 * @fileoverview Middleware for authentication
 * @module middlewares/auth
 */
const exports = {
    /**
     * Middleware to not allow logged in users to access login and register pages
     * 
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Function} next - Next function
     */
    restrictions(req, res, next) {
        if (req.session.user && (req.originalUrl == '/login' || req.originalUrl == '/register')) {
            return res.redirect('/');
        }
        next();
    },
};

export default exports;