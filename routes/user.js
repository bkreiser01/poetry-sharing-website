// Package Imports
import { Router } from "express";
const router = Router();

// Local Imports
import validation from "../helpers/validation.js";
import user from "../data/user.js";

router.route('/')

    .get(async (req, res) => {
        return res.render("/user", {
            title: "user",
            layout: "default",
            showLeftColumn: false,
            showRightColumn: false,
          });
    })

router.route('/searchByUsername/:username')
    .get(async (req, res) => {
        try {
            // Get the user
            let userData = await user.searchByUsername(req.params.username);

            // Return the user
            return res.status(200).json(userData);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    })


export default router