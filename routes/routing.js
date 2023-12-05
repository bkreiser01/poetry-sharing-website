//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
import {CreateNewTag, SearchForTag} from '../data/tags.js';
//import {seedDb} from '../config/seed.js';
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

//Route to add new tag to the database
router.route('/CreateNewTag').post(async (req, res) => {
    //Add to database
    let TagString = req.body.newTagString;
    let PoemID = req.body.newTaggedPoem;
    try {
        await CreateNewTag(TagString, PoemID);
    } catch (e) {
        console.log(e);
    }

    //Refresh page
    return res.redirect('/tagTest');
});

//Route to search for tags in the database
router.route('/SearchForTag').post(async (req, res) => {
    //Search for tag
    let TagString = req.body.SearchTagString;
    let FoundTag;
    try {
        FoundTag = await SearchForTag(TagString);
        console.log(FoundTag);
    } catch (e) {
        console.log(e);
    }

    //Refresh page
    return res.redirect('/tagTest');
});

export default router;