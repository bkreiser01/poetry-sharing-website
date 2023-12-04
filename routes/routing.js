//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    res.render('homepage', {title:"Poetry Sharing"});
});

router.route('/user').get(async (req, res) => {
    res.render('user', {title:"User"});
});

router.route('/login').get(async (req, res) => {
    res.render('login', {title:"Login"});
});

router.route('/register').get(async (req, res) => {
    res.render('register', {title:"Register"});
});

router.route('/poem').get(async (req, res) => {
    res.render('poem', {title:"Poem"});
});

router.route('/editor').get(async (req, res) => {
    res.render('editor', {title:"Editor"});
});

export default router;