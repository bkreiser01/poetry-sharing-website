//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
import {CreateNewTag, SearchForTag} from '../data/tags.js';
//import {seedDb} from '../config/seed.js';
const router = Router();

router.route('/').get(async (req, res) => {
    res.status(200).render('homepage', {title:"Poetry Sharing"});
});

router.route('/user').get(async (req, res) => {
    res.status(200).render('user', {title:"User"});
});


router.route('/poem').get(async (req, res) => {
    res.status(200).render('poem', {title:"Poem"});
});

router.route('/editor').get(async (req, res) => {
    res.status(200).render('editor', {title:"Editor"});
});

router.route('/tagTest').get(async (req, res) => {
    res.status(200).render('tagTest', {title:"Testing Tags"});
});

router.route('/CreateNewTag').post(async (req, res) => {
    //Route to add new tag to the database
    //Validate here

    //Add to database
    let TagString = req.body.newTagString;
    let PoemID = req.body.newTaggedPoem;
    await CreateNewTag(TagString, PoemID);

    //Refresh page
    return res.redirect('/tagTest');
});

router.route('/SearchForTag').post(async (req, res) => {
    //Route to search for tags in the database
    //Validate here

    //Search for tag
    let TagString = req.body.SearchTagString;
    let FoundTag = await SearchForTag(TagString);
    console.log(FoundTag);

    //Refresh page
    return res.redirect('/tagTest');
});

export default router;