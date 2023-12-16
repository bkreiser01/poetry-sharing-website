import { Router } from "express";
const router = Router();
import { poemData, tagData, userData } from "../data/index.js";
import validation from "../helpers/validation.js";
import { ObjectId } from "mongodb";
import markdown, { getCodeString } from "@wcj/markdown-to-html";
import xss from "xss";

router.route("/").get(async (req, res) => {
  let poemIdList;
  let poemList;
  let noPoem = false;

  const poemSort = (poemA, poemB) => {
    return poemA.timeSubmitted - poemB.timeSubmitted;
  };

  const userId = xss(req?.session?.user?._id);

  if (!userId) return res.redirect("/popular");

  // TODO get the user's following ids
  // TODO use the following ids to get the most recent poems then put them in order
  try {
    const user = await userData.getById(userId);
    const followingList = user.following;
    poemList = await Promise.all(
      followingList.map(async (id) => {
        const curUser = await userData.getById(id.toString());
        const newPoemList = await Promise.all(
          curUser.poemIds.map(async (id) => {
            const poem = await poemData.getPoemById(id.toString());
            let newPoem = {
              _id: poem._id,
              timeSubmitted: poem.timeSubmitted,
              title: poem.title,
              userId: poem.userId,
              username: curUser.username,
              tagCount: poem.totalTagCount,
            };
            return newPoem;
          })
        );
        return newPoemList;
      })
    );
    poemList = poemList.flat(Infinity);
    poemList = poemList.sort(poemSort);
    return res.render("homepage", {
      noPoem: noPoem,
      poemList: poemList,
      showLeftColumn: true,
      showRightColumn: true,
    });
  } catch (e) {
    return res.status(404).render("error", { error: e.toString() });
  }
});

export default router;
