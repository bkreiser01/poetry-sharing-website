// Package Imports
import {Router} from 'express';
const router = Router();

// Local Imports
import validation from '../helpers/validation.js'
import user from '../data/user.js'

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

            // Return a success
            return res.status(200).json({success: true});
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    })

router.route('/register')

    // GET /register
    .get(async (req, res) => {
        res.status(200).render('register', {title:"Register"});
    })

    // POST /register
    .post(async (req, res) => {
        try {
            // Get the register user data from the request body
            let registerUser = req.body;

            // Validate the register user
            registerUser = validation.checkRegisterFields(registerUser);

            // Attempt to register the user
            registerUser = await user.addUser(
                registerUser.username,
                registerUser.email,
                registerUser.password,
                registerUser.privacy
            );

            // Return a success
            return res.status(200).json({success: true});
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    })

router.route('/logout')

    // GET /logout
    .get(async (req, res) => {
        // If there is a user destroy the session and render the logout page,
        // otherwise redirect to the login page
        if (req.session.user) {
            req.session.destroy();
            res.status(200).render('logout', {title:"Logout"});
        } else {
            res.redirect('/login')
        }
    });


router.route('/check-authentication')

    // GET /check-authentication
    .get(async (req, res) => {
        // If there is a user return a success, otherwise return an error
        if (req.session.user) {
            res.status(200).json({authenticated: true});
        } else {
            res.status(200).json({authenticated: false});
        }
    });

export default router;