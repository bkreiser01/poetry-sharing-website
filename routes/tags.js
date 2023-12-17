// Package Imports
import { Router } from "express";
const router = Router();
import xss from "xss";

// Local Imports
import validation from "../helpers/validation.js";
import tagsData from '../data/tags.js';

router.route('/popular')
    .get(async (req, res) => {
        try {
            let popularTags = await tagsData.getFavoriteTags();
            res.status(200).json(popularTags);
        } catch (e) {
            res.status(500).render("error", {
                title: "Error",
                error: e,
            });
        }
    })
export default router;