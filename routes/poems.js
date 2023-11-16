// routing for poems collection

import { Router } from "express";
const router = Router();
import { poemData } from "../data/index.js";

router.route("/new").get(async (req, res) => {
   const users = await userData.getAllUsers();
   res.render("newpoem", { users: users });
});

// For this we probably want to use middle ware
// to check if the user is who they say they are
// (for privated poems and posting/updating poems)
router
   .route("/:id")
   .get(async (req, res) => {
      try {
         // TODO Validate id
         req.params.id = req.params.id; // Validation standin replace
      } catch (e) {
         // Make this an error html page
         return res.status(400).render("error", { error: e });
      }
      try {
         const poem = await poemData.getPoemById(req.params.id);
      } catch (e) {
         res.status(404).json({ error: e });
      }
   })
   .put(async (req, res) => {})
   .patch(async (req, res) => {})
   .delete(async (req, res) => {
      // TODO Validate id

      try {
         let deletedPoem = await poemData.removePoem(req.params.id);

         // TODO need poem delete handlebar
         res.status(200).json(deletedPoem);
      } catch (e) {
         let status = e[0];
         let message = e[1];
         res.status(status).json({ error: message });
      }
   });
