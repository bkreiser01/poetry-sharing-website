/**
 * @fileoverview Index of middlewares
 * @module middlewares/index
 */
import general from './general.js'
import auth from './auth.js'

const exports = {
    ...general,
    ...auth
}

export default exports