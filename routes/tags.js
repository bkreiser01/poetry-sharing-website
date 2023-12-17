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
            let popularTags = await tagsData.getMostPopularTags();
            res.status(200).json(popularTags);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    })

router.route('/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validation.checkId(xss(req.params.id), "Tag id")
            let tag = await tagsData.getTagById(req.params.id)
            res.status(200).json(tag);
        } catch (e) {
            res.status(500).json({ error: e })
        }
    })
export default router;