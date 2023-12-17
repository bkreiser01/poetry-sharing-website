// Package Imports
import { Router } from "express";
const router = Router();
import xss from "xss";

// Local Imports
import validation from "../helpers/validation.js";
import tags from '../data/tags.js';

/*
* Routes: /tags
* /popular
* /testing
* /createNewTag
* /search/:searchString
* /addTagToPoem
* /:id
*/


router.route('/popular')
    .get(async (req, res) => {
        //Route to display popular tags

        //Get array of tag objects, sorted by number of associated poems
        try {
            let popularTags = await tags.getMostPopularTags();
            res.status(200).json(popularTags);
        } catch (e) {
            res.status(500).json({ error: e });
        }
});


router.route("/testing")
    .get(async (req, res) => {
        //Route for testing tags
        res.status(200).render("tags/testing", { title: "Testing Tags" });
});
    

router.route("/createNewTag").post(async (req, res) => {
    //Route to add new tag to the database
    //Validate here
    
    //Add to database
    let TagString = req.body.newTagString;
    let PoemID = req.body.newTaggedPoem;
    let newTag;
    if(PoemID !== ""){
        try{
            newTag = await tags.addTagToPoem(TagString, PoemID);
        } catch (e) {
            console.log(e);
        }
    }else {
        try{
            newTag = await tags.createNewTag(TagString);
        } catch (e) {
            console.log(e);
        }
    }
    
    //Return newly created tag object
    return newTag;
});
    
router.route("/search").post(async (req, res) => {
    //Route to search for tags in the database
    //Validate here

    //Set URL
    let URL = "search/".concat(req.body.searchString);

    //Redirect to search result page
    res.redirect(URL);
});


router.route("/search/:searchString").get(async (req, res) => {
    //Route to search for tags in the database
    //Validate here
    
    //Get search results
    let searchString = req.params.searchString;
    let foundTags;
    try{
        foundTags = await tags.searchTags(searchString);
    } catch (e) {
        console.log(e);
    }

    //Load search result page
    res.status(200).render("tags/search", { title: "Tag Search", foundTags: foundTags });
});
    

router.route("/addTagToPoem").post(async (req, res) => {
    //Route to add tag to poem
    //Validate here
    
    //Add to database
    let TagString = req.body.tagString;
    let PoemID = req.body.taggedPoemId;
    let updatedTag;
    try{
        updatedTag = await tags.addTagToPoem(TagString, PoemID);
    } catch (e) {
        console.log(e);
    }

    //Return tag object
    return updatedTag;
});


router.route('/:id')
    .get(async (req, res) => {
        //Route to display poems associated with tag of given id

        //Get tag object from id
        let foundTag;
        try {
            let tagId = validation.checkId(xss(req.params.id), "Tag id");
            foundTag = await tags.getTagById(tagId);
        } catch (e) {
            res.status(500).json({ error: e })
        }

        //Load tag page
        res.status(200).json(foundTag);
});


export default router;