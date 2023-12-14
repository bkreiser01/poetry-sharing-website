/**
 * @fileoverview General middlewares
 * @module middlewares/general
 */
const exports = {
    /**
     * Browsers like to get the favicon and that clutters up the console
     * so this middleware will just return a 204 No Content response
     * 
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Function} next - Next function
     */
    favicon(req, res, next) {
        if (req.originalUrl === '/favicon.ico') {
            return res.status(204).end();
        } else {
            next();
        }
    },

    /**
     * Logging middleware
     * 
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Function} next - Next function
     */
    log(req, res, next) {
        let log = "[" + new Date().toUTCString() + "]: ";
            if (req.session.user) {
                log += "(" + req.session.user.username + ") "
            }
            log += req.method + " "
            log += req.originalUrl + " "
        console.log(log);
        next();
    },
};

export default exports;