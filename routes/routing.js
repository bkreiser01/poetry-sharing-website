//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
    //code here for GET will render the home handlebars file
    res.render('homepage', {title:"Poetry Sharing"});
});

export default router;