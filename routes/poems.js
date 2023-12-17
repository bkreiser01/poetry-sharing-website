// routing for poems collection

import { Router } from "express";
const router = Router();
import { poemData, tagData, userData } from "../data/index.js";
import validation from "../helpers/validation.js";
import { ObjectId } from "mongodb";
import markdown, { getCodeString } from "@wcj/markdown-to-html";
import xss from "xss";

const checkIsAuthor = async (userId, poemId) => {
   const poem = await poemData.getPoemById(poemId);
   return poem.userId.toString() === userId;
};

router.route("/").get(async (req, res) => {
   // Can change to redirect somewhere else
   res.redirect("/poems/new");
});

router
   .route("/new")
   .get(async (req, res) => {
      // TODO change this to be middleware based
      const userId = xss(req?.session?.user?._id);

      if (!userId) {
         res.redirect("/login");
      }

      res.render("poems/new", {
         title: "New Poem",
         showLeftColumn: true,
         showRightColumn: true,
      });
   })
   .post(async (req, res) => {
      let title, body, link, priv;
      const timeSubmitted = new Date();
      const userId = xss(req?.session?.user?._id);

      // TODO change link to linkInput in handlebars

      // Check the user is logged in
      // TODO change to be middle ware based
      if (!xss(userId)) {
         const status = 401;
         return res.status(status).render("error", {
            error: "You must be logged in to submit a poem",
         });
      }

      // Check the user submitted data
      if (!xss(req.body)) {
         return res.render("poems/new", { error: "No input provided" });
      }

      // Validate input
      try {
         title = validation.checkString(xss(req.body.title), "Title");
         body = validation.checkString(xss(req.body.body), "Body");
         if (xss(req.body.linkInput))
            link = validation.checkString(xss(req.body.linkInput), "Link");
         if (xss(req.body.private))
            priv = validation.checkString(xss(req.body.private), "Private");
      } catch (e) {
         const status = 400;
         return res.status(status).render("error", { error: e });

         // TODO see if it makes sense to refill or if this should only be done on client side
         /*
         return res.render("poems/new", {
            poem: { title: title, body: body, link: link },
            errors: errors,
         });
         */
      }

      priv = priv === "true" ? true : false; // priv to true if "true", false otherwiser

      // add poem to poems collection
      let newPoem;
      try {
         newPoem = await poemData.addPoem(
            timeSubmitted,
            title,
            body,
            userId,
            link,
            priv
         );
         if (!newPoem) {
            throw new Error(`Poem could not be added`);
         }
      } catch (e) {
         const status = 400;
         return res.status(status).render("error", { error: e });
      }

      // Add poem to user.poemIds
      try {
         const updatedUser = await userData.addPoem(
            userId,
            newPoem._id.toString()
         );
         if (!updatedUser) {
            throw new Error(`Poem could not be added to user`);
         }
      } catch (e) {
         const status = 400;
         return res.status(status).render("error", { error: e });
      }

      // only redirect if everything is added successfully
      return res.redirect(`/poems/${newPoem._id.toString()}`);
   });

// For this we probably want to use middle ware
// to check if the user is who they say they are
// (for privated poems and posting/updating poems)
router
   .route("/:id")
   .get(async (req, res) => {
      let safeId, poem, username;

      try {
         safeId = validation.checkId(xss(req.params.id), "id");
         poem = await poemData.getPoemById(safeId);
         poem.body = markdown(poem.body);

         // check that the user is loged in and add this poem to their recentlyViewed
      } catch (e) {
         const status = 404;
         return res
            .status(status)
            .render("error", { error: "Poem could not be found" });
      }

      try {
         const userId = xss(req?.session?.user?._id);
         if (!!userId) await userData.addRecentlyViewedPoem(userId, safeId);
      } catch (e) {
         // Error isn't critical so don't need to tell the user about it rly
         console.error(`${e.toString()}`);
      }

      // get user name for by
      try {
         const user = await userData.getById(poem.userId.toString());
         username = user.username;
      } catch (e) {
         username = "User Not Found";
      }

      // TODO button for editing
      let isAuthor = false;
      try {
         isAuthor = await checkIsAuthor(xss(req?.session?.user?._id), safeId);
      } catch (error) {
         isAuthor = false;
      }
      try {
         return res.render("poems/view", {
            title: poem.title,
            userId: req.session.user._id,
            poemId_: poem._id,
            poem: poem,
            username: username,
            isAuthor: isAuthor,
         });
      } catch (e) {
         return res.status(500).render("error", { error: e });
      }
   })
   .delete(async (req, res) => {
      // TODO check they're logged in and the author
      const userId = xss(req?.session?.user?._id);
      const safeId = validation.checkId(xss(req.params.id), "id");

      if (!checkIsAuthor(userId, safeId)) {
         return res.status(403).render("error", {
            error: `You must be the author of a poem to delete it`,
         });
      }

      try {
         const poemInfo = await poemData.removePoem(safeId);
         await userData.deletePoem(userId, safeId);
         await userData.deletePoemFromAllUsers(safeId);
         const tagInfo = await tagData.deletePoemFromAllTags(safeId);
      } catch (e) {
         const status = 400;
         return res.status(status).render("error", { error: e.message });
      }

      return res.redirect(200, "/user");
   });

router
   .route("/edit/:id")
   .get(async (req, res) => {
      // TODO check that the user is the author and if they are send them the edit page otherwise redirect
      let safeId, poem;
      const userId = xss(req?.session?.user?._id);

      try {
         safeId = validation.checkId(xss(req.params.id), "id");
         poem = await poemData.getPoemById(safeId);
      } catch (e) {
         const status = 404;
         return res
            .status(status)
            .render("error", { error: "Poem could not be found" });
      }

      // User is the author, send them the edit page
      if (poem.userId.toString() === userId.toString()) {
         return res.render("poems/edit", { poem: poem });
      }

      // User is not the editor so redirect to view page

      return res.redirect(`/poems/${safeId}`);
   })
   .patch(async (req, res) => {
      // TODO  check the user is the author then patch the data otherwise send them to error page

      let safeId, poem;
      let inputData = {};
      const userId = xss(req?.session?.user?._id);

      try {
         safeId = validation.checkId(xss(req.params.id), "id");
         poem = await poemData.getPoemById(safeId);
      } catch (e) {
         const status = 404;
         return res
            .status(status)
            .render("error", { error: "Poem could not be found" });
      }

      // User is not the author so error (should never be reached)
      if (poem.userId.toString() !== userId.toString()) {
         const status = 403;
         return res
            .status(status)
            .render("error", { error: "You are not the author of this poem" });
      }

      //  user is logged in and the author

      try {
         if (!!xss(req?.body?.title) || xss(req?.body?.title) === "") {
            inputData.title = validation.checkTitle(xss(req?.body?.title)); // TODO validate title
         }
         if (!!xss(req?.body?.body)) {
            inputData.body = validation.checkBody(xss(req?.body?.body)); // TODO validate body
         }
         if (!!xss(req?.body?.linkInput)) {
            inputData.linkInput = validation.checkUrl(
               xss(req?.body?.linkInput)
            ); // TODO validate link
         }
         if (!!xss(req.body?.priv)) {
            inputData.priv = validation.checkString(xss(req?.body?.priv)); // TODO validate private
         }
      } catch (e) {
         return res.status(400).render("error", { error: e });
      }

      try {
         const updatedPoem = await poemData.updatePoemPatch(safeId, inputData);
         return res.redirect(200, `/poems/${safeId}`);
      } catch (e) {
         let status = 400;
         return res.status(status).render("error", { error: e.toString() });
      }
   });

router.route("/getPoemById/:id").get(async (req, res) => {
   try {
      const poem = await poemData.getPoemById(req.params.id);
      res.json(poem);
   } catch (e) {
      res.status(404).json({ error: e.toString() });
   }
});

export default router;
