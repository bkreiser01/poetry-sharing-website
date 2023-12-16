//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import { Router } from "express";
import tags from "../data/tags.js";
//import {seedDb} from '../config/seed.js';
const router = Router();

// router.route("/").get(async (req, res) => {
//   res.status(200).render("homepage", { title: "Poetry Sharing" });
// });

router.route("/editor").get(async (req, res) => {
  res.status(200).render("editor", { title: "Editor" });
});

router.route("/tagTest").get(async (req, res) => {
  res.status(200).render("tagTest", { title: "Testing Tags" });
});

router.route("/CreateNewTag").post(async (req, res) => {
  //Route to add new tag to the database
  //Validate here

  //Add to database
  let TagString = req.body.newTagString;
  let PoemID = req.body.newTaggedPoem;
  if(PoemID !== ""){
    try{
      await tags.addTagToPoem(TagString, PoemID);
    } catch (e) {
      console.log(e);
    }
  }else {
    try{
      await tags.createNewTag(TagString);
    } catch (e) {
      console.log(e);
    }
  }
  
  //Refresh page
  return res.redirect("/tagTest");
});

router.route("/SearchForTag").post(async (req, res) => {
  //Route to search for tags in the database
  //Validate here

  //Search for tag
  let TagString = req.body.SearchTagString;
  let FoundTag;
  try{
    FoundTag = await tags.getTagByName(TagString);
  } catch (e) {
    console.log(e);
  }
  console.log(FoundTag);

  //Refresh page
  return res.redirect("/tagTest");
});

router.route("/AddTagToPoem").post(async (req, res) => {
  //Route to add tag to poem
  //Validate here

  //Add to database
  let TagString = req.body.tagString;
  let PoemID = req.body.taggedPoemId;
  try{
    await tags.addTagToPoem(TagString, PoemID);
  } catch (e) {
    console.log(e);
  }
});

router.route("/testing").get(async (req, res) => {
  return res.render("void", {
    title: "void-page",
    layout: "default",
    showLeftColumn: true,
    showRightColumn: true,
  });
});

export default router;
