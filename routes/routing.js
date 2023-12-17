//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import { Router } from "express";
const router = Router();

// router.route("/").get(async (req, res) => {
//   res.status(200).render("homepage", { title: "Poetry Sharing" });
// });

router.route("/editor").get(async (req, res) => {
  res.status(200).render("editor", { title: "Editor" });
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