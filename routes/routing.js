//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
import {CreateNewTag} from '../data/index.js';
import {seedDb} from '../config/seed.js';
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

router.route('/poem').get(async (req, res) => {
    res.render('poem', {title:"Poem"});
});

router.route('/editor').get(async (req, res) => {
    res.render('editor', {title:"Editor"});
});

router.route('/tagTest').get(async (req, res) => {
    res.render('tagTest', {title:"Testing Tags"});
});

router.route('/CreateNewTag').post(async (req, res) => {
    //Validate here

    //Add to database
    let TagString = req.body.newTagString;
    let PoemID = req.body.newTaggedPoem;
    await CreateNewTag(TagString, PoemID);

    //Render again
    return res.redirect('/tagTest');
});

export default router;