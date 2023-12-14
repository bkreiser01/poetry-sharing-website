/**
 * @fileoverview Middleware for authentication
 * @module middlewares/auth
 */
const exports = {
    /**
     * Middleware to restrict the user based on auth status
     * 
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Function} next - Next function
     */
    restrictions(req, res, next) {
        // Prevent an authenticated user from accessing the login and register pages
        if (req.session.user && (
            req.originalUrl == '/login' ||
            req.originalUrl == '/register'
        )) {
            return res.redirect('/');
        }

        if (!req.session.user && (
            req.originalUrl == '/user' || 
            req.originalUrl == '/user/liked-poems' || 
            req.originalUrl == '/user/tagged-poems' || 
            req.originalUrl == '/user/followers' || 
            req.originalUrl == '/user/following' || 
            req.originalUrl == '/user/history' || 
            req.originalUrl == '/user/edit' ||
            req.originalUrl == '/logout'
        )) {
            return res.redirect('/');
        }


        next();
    },
};

export default exports;