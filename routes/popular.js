import { Router } from "express";
const router = Router();
import { poemData, tagData, userData } from "../data/index.js";
import validation from "../helpers/validation.js";
import { ObjectId } from "mongodb";
import xss from "xss";

router.route("/").get(async (req, res) => {
   let poemList;
   let noPoem = false;
   try {
      poemList = await poemData.getMostPopularPoems();
      poemList = await Promise.all(
         poemList.map(async (poem) => {
            let newPoem = {
               _id: poem._id.toString(),
               title: poem.title,
               userId: poem.userId.toString(),
               username: "",
            };

            const user = await userData.getById(poem.userId.toString());
            newPoem.username = user.username;

            return newPoem;
         })
      );
   } catch (e) {
      return res.status(404).render("error", { error: e.toString() });
   }

   if (poemList.length <= 0) noPoem = true;

   return res.render("popular", { title: "Popular Poems", poemList: poemList, noPoem: noPoem });
});

export default router;
