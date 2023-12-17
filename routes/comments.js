import { Router } from "express";
const router = Router();
import xss from "xss";

import validation from "../helpers/validation.js";
import { commentData } from "../data/index.js";

// Routes for the poem view page
router
  .route("/poems/:poemId/comments")
  .get(async (req, res) => {
    try {
      const comment = commentData.getAllCommentsFromPoem(req.params.poemId);
      res.json(comment);
    } catch (e) {
      res.status(404).json({ error: e.toString() });
    }
  })
  .post(async (req, res) => {
    try {
      req.params.poemId = validation.checkId(xss(req.params.poemId), "poemId");

      let data = req.body;
      data.tagId = validation.checkId(xss(data.tagId), "tagId");
      data.commentString = validation.checkBody(
        xss(data.commentString),
        "commentString"
      );

      if (!req.session.user) {
        return res
          .status(401)
          .json({ error: "You must be logged in to post a comment" });
      }

      let updatedPoem = await commentData.addCommentToPoem(
        req.session.user._id,
        data.tagId,
        Date(Date.now()),
        data.commentString,
        req.params.poemId
      );
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

export default router;
