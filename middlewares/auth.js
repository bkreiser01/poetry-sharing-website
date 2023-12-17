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
        try {
            // Prevent an authenticated user from accessing the login and register pages
            if (req.session.user && (
                req.originalUrl == '/login' ||
                req.originalUrl == '/register'
            )) {
                return res.redirect('/');
            }

            // Prevent an unauthenticated user from accessing the dashboard
            if (!req.session.user && 
                req.originalUrl != '/login' && 
                req.originalUrl != '/register'
            ) {
                return res.redirect('/login');
            }
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }

        next();
    },
};

export default exports;