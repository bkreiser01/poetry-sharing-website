// routing for poems collection

import { Router } from "express";
const router = Router();
import { poemData } from "../data/index.js";
import validation from "../helpers/validation.js";
import { ObjectId } from "mongodb";
import markdown, { getCodeString } from "@wcj/markdown-to-html";

router.route("/").get(async (req, res) => {
   // Can change to redirect somewhere else
   res.redirect("/poems/new");
});

router
   .route("/new")
   .get(async (req, res) => {
      res.render("poems/new", {
         title: "New Poem",
      });
   })
   .post(async (req, res) => {
      const inputData = req.body;
      let errors = [];

      if (!req.body) {
         return res.render("poems/new", { error: "No input provided" });
      }

      try {
         inputData.title = validation.checkString(
            inputData.title.trim(),
            "Title"
         );
      } catch (e) {
         errors.push(e);
      }

      try {
         inputData.body = validation.checkString(inputData.body.trim(), "Body");
      } catch (e) {
         errors.push(e);
      }

      if (inputData.link) {
         try {
            inputData.link = validation.checkString(
               inputData.link.trim(),
               "Link"
            );
         } catch (e) {
            errors.push(e);
         }
      }

      if (inputData.private === "true") {
         inputData.private = true;
      } else {
         inputData.private = false;
      }

      const timeSubmitted = new Date();
      const userId = new ObjectId(); // TODO get from cookie

      if (errors.length > 0) {
         return res.render("poems/view", {
            poem: {
               title: inputData.title,
               body: inputData.body,
               link: inputData.link,
            },
            errors: errors,
         });
      }

      try {
         const newPoem = await poemData.addPoem(
            timeSubmitted,
            inputData.title,
            inputData.body,
            userId.toString(),
            inputData.link,
            inputData.private
         );
         res.redirect(`/poems/${newPoem._id}`);
      } catch (e) {
         res.render("poems/view", { error: e });
      }
   });

// For this we probably want to use middle ware
// to check if the user is who they say they are
// (for privated poems and posting/updating poems)
router
   .route("/:id")
   .get(async (req, res) => {
      let poem;
      let user;
      try {
         req.params.id = validation.checkId(req.params.id); // Validation standin replace
      } catch (e) {
         return res.status(400).render("error", { error: e });
      }

      try {
         poem = await poemData.getPoemById(req.params.id);
      } catch (e) {
         res.status(404).json({ error: e });
      }

      try {
         poem.body = markdown(poem.body);
      } catch (e) {
         // TODO IDK handle the error when markdown don't work
         return res.redirect("error");
      }

      // try {
      //    user = await userData.getUserById(poem.userId);
      // } catch (e) {
      //    res.status(404).json({ error: e });
      // }

      res.render("poems/view", { title: poem.title, poem: poem });
   })
   .patch(async (req, res) => {
      const inputData = req.body;
      // TODO validate body not undefined
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
      // TODO Validate id

      req.params.id = validation.checkId(req.params.id);

      try {
         let deletedPoem = await poemData.removePoem(req.params.id);

         res.status(200).json(deletedPoem); // TODO change to render need poem delete handlebar
      } catch (e) {
         res.status(404).json({ error: e.toString() });
      }
   });


router.route('/getPoemById/:id')
   .get(async (req, res) => {
      try {
         const poem = await poemData.getPoemById(req.params.id);
         res.json(poem);
      } catch (e) {
         res.status(404).json({ error: e.toString() });
      }
   });
export default router;
