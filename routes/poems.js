// routing for poems collection

import { Router } from "express";
const router = Router();
import { poemData, tagData, userData } from "../data/index.js";
import validation from "../helpers/validation.js";
import { ObjectId } from "mongodb";
import markdown, { getCodeString } from "@wcj/markdown-to-html";
import xss from "xss";

router.route("/").get(async (req, res) => {
   // Can change to redirect somewhere else
   res.redirect("/poems/new");
});

router
   .route("/new")
   .get(async (req, res) => {
      // TODO change this to be middleware based
      const userId = xss(req?.session?.user?._id);

      if (!userId) {
         res.redirect("/login");
      }

      res.render("poems/new", {
         title: "New Poem",
         showLeftColumn: true,
         showRightColumn: true,
      });
   })
   .post(async (req, res) => {
      let title, body, link, priv;
      const timeSubmitted = new Date();
      const userId = xss(req?.session?.user?._id);

      // TODO change link to linkInput in handlebars

      // Check the user is logged in
      // TODO change to be middle ware based
      if (!xss(userId)) {
         const status = 401;
         return res.status(status).render("error", {
            error: "You must be logged in to submit a poem",
         });
      }

      // Check the user submitted data
      if (!xss(req.body)) {
         return res.render("poems/new", { error: "No input provided" });
      }

      // Validate input
      try {
         title = validation.checkString(xss(req.body.title), "Title");
         body = validation.checkString(xss(req.body.body), "Body");
         if (xss(req.body.linkInput))
            link = validation.checkString(xss(req.body.linkInput), "Link");
         if (xss(req.body.private))
            priv = validation.checkString(xss(req.body.private), "Private");
      } catch (e) {
         const status = 400;
         return res.status(status).render("error", { error: e });

         // TODO see if it makes sense to refill or if this should only be done on client side
         /*
         return res.render("poems/new", {
            poem: { title: title, body: body, link: link },
            errors: errors,
         });
         */
      }

      priv = priv === "true" ? true : false; // priv to true if "true", false otherwiser

      // add poem to poems collection
      let newPoem;
      try {
         newPoem = await poemData.addPoem(
            timeSubmitted,
            title,
            body,
            userId,
            link,
            priv
         );
         if (!newPoem) {
            throw new Error(`Poem could not be added`);
         }
      } catch (e) {
         const status = 400;
         return res.status(status).render("error", { error: e });
      }

      // Add poem to user.poemIds
      try {
         const updatedUser = await userData.addPoem(
            userId,
            newPoem._id.toString()
         );
         if (!updatedUser) {
            throw new Error(`Poem could not be added to user`);
         }
      } catch (e) {
         const status = 400;
         return res.status(status).render("error", { error: e });
      }

      // TODO only redirect if everything is added successfully

      return res.redirect(`/poems/${newPoem._id.toString()}`);
   });

// For this we probably want to use middle ware
// to check if the user is who they say they are
// (for privated poems and posting/updating poems)
router
   .route("/:id")
   .get(async (req, res) => {
      let safeId, poem, username;

      try {
         safeId = validation.checkId(xss(req.params.id), "id");
         poem = await poemData.getPoemById(safeId);
         poem.body = markdown(poem.body);
      } catch (e) {
         const status = 404;
         return res
            .status(status)
            .render("error", { error: "Poem does not exist" });
      }

      //TODO get user name for by
      try {
         const user = await userData.getById(poem.userId.toString());
         username = user.username;
      } catch (e) {
         username = "User Not Found";
      }

      return res.render("poems/view", {
         title: poem.title,
         poem: poem,
         username: username,
      });
   })
   .patch(async (req, res) => {
      const inputData = xss(req.body);
      // TODO validate body not undefined
      if (req.body)
         try {
            req.params.id = req.params.id; // TODO validate id
            if (inputData.timeSubmitted !== undefined) {
               inputData.timeSubmitted = validation.checkString(
                  inputData.timeSubmitted
               ); // TODO validate timeSubmitted
            }
            if (inputData.title !== undefined) {
               inputData.title = validation.checkString(inputData.title); // TODO validate title
            }
            if (inputData.body !== undefined) {
               inputData.body = validation.checkString(inputData.body); // TODO validate body
            }
            if (inputData.link !== undefined) {
               inputData.link = validation.checkUrl(inputData.link); // TODO validate link
            }
            if (inputData.private !== undefined) {
               inputData.private = inputData.private; // TODO validate private
            }
         } catch (e) {
            return res.status(400).render("error", { error: e });
         }

      try {
         const updatedPoem = await poemData.updatePoemPatch(
            req.params.id,
            inputData
         );

         res.json(updatedPoem); // TODO change to poem render
      } catch (e) {
         let status = e[0];
         let message = e[1];
         res.status(status).json({ error: message });
      }
   })
   .delete(async (req, res) => {
      const safeId = validation.checkId(xss(req.params.id), "id");
      s;

      try {
         const poemInfo = await poemData.removePoem(safeId);
         await userData.deletePoemFromAllUsers(safeId);
         const tagInfo = await tagData.deletePoemFromAllTags(safeId);
      } catch (e) {
         const status = 400;
         return res.status(status).render("error", { error: e.message });
      }
      // TODO return something to indicate the deletion was succesfull
   });

router.route("/getPoemById/:id").get(async (req, res) => {
   try {
      const poem = await poemData.getPoemById(req.params.id);
      res.json(poem);
   } catch (e) {
      res.status(404).json({ error: e.toString() });
   }
});


export default router;
