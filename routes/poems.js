// routing for poems collection

import { Router } from "express";
const router = Router();
import { poemData } from "../data/index.js";

router.route("/").get(async (req, res) => {
   // Can change to redirect somewhere else
   res.redirect("/poems/new");
});

router
   .route("/new")
   .get(async (req, res) => {
      res.render("poems/new", {
         poem: { title: "pwned", body: "you have been trolled poser" },
      });
   })
   .post(async (req, res) => {
      res.json(req.body);
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
         // TODO Validate id
         req.params.id = req.params.id; // Validation standin replace
      } catch (e) {
         return res.status(400).render("error", { error: e });
      }
      try {
         poem = await poemData.getPoemById(req.params.id);
      } catch (e) {
         res.status(404).json({ error: e });
      }
      try {
         user = await userData.getUserById(poem.userId);
      } catch (e) {
         res.status(404).json({ error: e });
      }
      // res.render("poems/view", )
   })
   .put(async (req, res) => {
      // TODO add with updatePoemPut
   })
   .patch(async (req, res) => {
      const requestBody = req.body;
      // TODO validate body not undefined
      try {
         req.params.id = req.params.id; // TODO validate id
         if (requestBody.timeSubmitted) {
            requestBody.timeSubmitted = requestBody.timeSubmitted; // TODO validate timeSubmitted
         }
         if (requestBody.title) {
            requestBody.title = requestBody.title; // TODO validate title
         }
         if (requestBody.body) {
            requestBody.body = requestBody.body; // TODO validate body
         }
         if (requestBody.userId) {
            requestBody.userId = requestBody.userId; // TODO validate userId
         }
         if (requestBody.link) {
            requestBody.link = requestBody.link; // TODO validate link
         }
         if (requestBody.private) {
            requestBody.private = requestBody.private; // TODO validate private
         }
      } catch (e) {
         return res.status(400).render("error", { error: e });
      }

      try {
         const updatedPoem = await poemData.updatePoemPatch(
            req.params.id,
            requestBody
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

      try {
         let deletedPoem = await poemData.removePoem(req.params.id);

         res.status(200).json(deletedPoem); // TODO change to render need poem delete handlebar
      } catch (e) {
         let status = e[0];
         let message = e[1];
         res.status(status).json({ error: message });
      }
   });

export default router;
