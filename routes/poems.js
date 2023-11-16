// routing for poems collection

import { Router } from "express";
const router = Router();
import { poemData } from "../data/index.js";

router.route("/new").get(async (req, res) => {
   const users = await userData.getAllUsers();
   res.render("poems/new", { users: users });
});
router
   .route("/:id")
   .get(async (req, res) => {
      try {
         // Validate
         req.params.id = req.params.id;
      } catch (e) {
         // Make this an error html page
         return res.status(400).json({ error: e });
      }
      try {
         const poem = await poemData.getPoemById(req.params.id);
      } catch (e) {
         res.status(404).json({ error: e });
      }
   })
   .put(async (req, res) => {})
   .patch(async (req, res) => {});
