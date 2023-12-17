import { Router } from "express";
const router = Router();
import xss from 'xss'

import validation from "../helpers/validation.js";
import { poemData, tagData, userData } from "../data/index.js";

router.route("/users/:searchTerm")
  .get(async (req, res) => {
    try {
      let searchTerm = validation.checkString(xss(req.params.searchTerm), "searchTerm");
      let userList = await userData.searchByUsername(searchTerm);
      return res.status(200).json(userList);
    } catch (e) {
      return res.status(404).json({ error: e.toString() });
    }    
  })

router.route("/poems/:searchTerm")
  .get(async (req, res) => {
    try {
      let searchTerm = validation.checkString(xss(req.params.searchTerm), "searchTerm");
      let poemList = await poemData.searchByTitle(searchTerm);
      poemList.push(...await poemData.searchByBody(searchTerm));
      

      let frequencyMap = poemList.reduce((map, item) => {
        const key = item._id; // Convert ObjectId to string for comparison
        map[key] = (map[key] || 0) + 1;
        return map;
      }, {});

      for (let i = poemList.length - 1; i >= 0; i--) {
        if (frequencyMap[poemList[i]._id] != 1) {
          frequencyMap[poemList[i]._id] = frequencyMap[poemList[i]._id] - 1
          poemList.splice(i, 1);
        }
      }
      return res.status(200).json(poemList);
    } catch (e) {
      return res.status(500).json({ error: e.toString() });
    }
  })
router.route("/tags/:searchTerm")
  .get(async (req, res) => {
    try {
        let searchTerm = validation.checkString(xss(req.params.searchTerm), "searchTerm");
        let tagList = await tagData.searchTags(searchTerm);
        return res.status(200).json(tagList);
    } catch (e) {
        return res.status(500).json({ error: e.toString() });
    }
  })
export default router;