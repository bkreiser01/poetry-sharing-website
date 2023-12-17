// Package Imports
import { Router } from "express";
const router = Router();
import xss from "xss";

// Local Imports
import validation from "../helpers/validation.js";
import tags from '../data/tags.js';
import users from '../data/user.js'

/*
* Routes: /tags
* /popular
* /testing
* /createNewTag
* /search
* /search/:searchString
* /addTagToPoem
* /:id
*/


router.route('/popular')
    .get(async (req, res) => {
        try {
            let popularTags = await tags.getMostPopularTags();
            res.status(200).json(popularTags);
        } catch (e) {
            res.status(500).json({ error: e });
        }
}); 

router.route("/createNewTag").post(async (req, res) => {
    //Route to add new tag to the database
    //Validate here
    
    //Add to database
    let UserID = xss(req?.body?.taggingUserId);
    let TagString = xss(req?.body?.newTagString);
    let PoemID = xss(req?.body?.newTaggedPoem);
    let newTag;
    if(PoemID !== ""){
        try{
            newTag = await users.addTagToPoem(UserID, TagString, PoemID);
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


router.route("/search/:searchString").get(async (req, res) => {
    //Route to search for tags in the database
    //Validate here
    
    //Get search results
    let searchString = xss(req?.params?.searchString);
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
    let TagString = xss(req?.body?.tagString);
    let PoemID = xss(req?.body?.taggedPoemId);
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
        try {
            let foundTag;
            let tagId = validation.checkId(xss(req.params.id), "Tag id");
            foundTag = await tags.getTagById(tagId);

            res.status(200).render("tags/view", { 
                Title: "Tag",
                tagString: foundTag.tagString,
                tagId: foundTag._id
            });
        } catch (e) {
            res.status(500).render("error", { title: "Error", error: e });
        }
});

router.route('/info/:id')
    .get(async (req, res) => {
        try {
            let foundTag;
            let tagId = validation.checkId(xss(req.params.id), "Tag id");
            foundTag = await tags.getTagById(tagId);

            res.status(200).json(foundTag);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });


export default router;