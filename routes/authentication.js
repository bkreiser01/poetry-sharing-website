// Package Imports
import {Router} from 'express';
const router = Router();

// Local Imports
import validation from '../helpers/validation.js'
import user from '../data/user.js'

// Login route
router.route('/login')

    // GET /login
    .get(async (req, res) => {
        res.status(200).render('login', {title:"Login"});
    })

    // POST /login
    .post(async (req, res) => {
        try {
            // Get the login user data from the request body
            let loginUser = req.body;

            // Validate the login user
            loginUser = validation.checkLoginFields(loginUser);

            // Attempt to login the user
            loginUser = await user.login(
                loginUser.username,
                loginUser.password
            );
            
            // Delete the hashed password from the user object for security
            delete loginUser.hashedPassword

            // Set the session user
            req.session.user = loginUser;
        
            throw new Error("Not implemented");
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    })

// Register route
router.route('/register')

    // GET /register
    .get(async (req, res) => {
        res.status(200).render('register', {title:"Register"});
    })

    // POST /register
    .post(async (req, res) => {

    })

export default router;