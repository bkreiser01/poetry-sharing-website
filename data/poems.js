/**
 * Contains all functions (other than comments) that interact with the poems collection
 *
 * @module data/poems
 *
 * The poem collection contains the following fields:
 *    - _id: ObjectId
 *    - timeSubmitted: Date
 *    - title: string
 *    - body: string
 *    - userId: ObjectId
 *    - link: string
 *    - submittedTags: array of submittedTag objects
 *    - totalTagCount: number
 *    - favoriteCount: number
 *    - comments: array of comment objects (see data/comments)
 *    - private: boolean
 *
 *  submittedTag object contains the following fields:
 *    - _id: ObjectId
 *    - tagId: ObjectId
 *    - tagCount: number
 */

import { poems } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../helpers/validation.js";
import userData from "./user.js";

/**
 * Sets a poem's tagCount according to total of submittedTags
 * @param {string | ObjectId} poemId
 * @returns {Object} updated poem object
 */
let setTotalTagCount = async (poemId) => {
   const poemCollection = await poems();
   const findPoemQuery = { _id: new ObjectId(poemId) };

   const poem = await poemCollection.findOne(findPoemQuery);
   if (!poem)
      throw new Error(
         `setTotalTagCount: Could not find poem with poemId: ${poemId}`
      );

   let newTagCount = 0;
   poem.submittedTags.forEach(
      (submittedTag) => (newTagCount += submittedTag.tagCount)
   );

   const updatedPoem = poemCollection.findOneAndUpdate(findPoemQuery, {
      $set: { totalTagCount: newTagCount },
   });

   if (!updatedPoem)
      throw new Error(`setTotalTagCount: could not update tagCount`);

   return updatedPoem;
};

const exportedMethods = {
   /**
    * Get a poem by it's ID
    *
    * @param {string | ObjectId} id
    * @returns
    */
   async getPoemById(id) {
      id = validation.checkId(id, "id");

      const poemCollection = await poems();
      const poem = await poemCollection.findOne({ _id: new ObjectId(id) });

      if (!poem) throw new Error("Error: Poem not found");
      return poem;
   },

   /**
    * Add a poem to the data base
    *
    * @param {Date} timeSubmitted
    * @param {string} title
    * @param {string} body
    * @param {string} userId
    * @param {string} link
    * @param {boolean} priv
    * @returns
    */
   async addPoem(
      timeSubmitted,
      title = "Untitled",
      body,
      userId,
      link = "",
      priv
   ) {
      timeSubmitted = validation.checkDate(timeSubmitted, "timeSubmitted");
      title = validation.checkString(title.trim(), "title");
      body = validation.checkString(body.trim(), "body");
      userId = validation.checkId(userId.trim(), "userId");
      if (!!link.trim()) {
         link = validation.checkUrl(link.trim(), "link");
      }
      priv = validation.checkBool(priv, "priv");

      const newPoem = {
         timeSubmitted: timeSubmitted,
         title: title,
         body: body,
         userId: new ObjectId(userId),
         link: link,
         submittedTags: [],
         totalTagCount: 0,
         favoriteCount: 0,
         comments: [],
         private: priv,
      };

      // insert the poem
      const poemCollection = await poems();
      const newPoemInsertInformation = await poemCollection.insertOne(newPoem);
      // check the poem was inserted
      if (
         !newPoemInsertInformation.acknowledged ||
         !newPoemInsertInformation.insertedId
      ) {
         throw new Error("poems/addPoem: could not add poem");
      }

      const newId = newPoemInsertInformation.insertedId;

      // Make sure the poem has been added
      const gotPoem = await this.getPoemById(newId.toString());
      if (!gotPoem) {
         throw new Error("poems/addPoem: could not find new poem");
      }

      // Add poem to the author's poemId list
      const updatedUser = userData.addPoem(userId, gotPoem._id.toString());
      if (!updatedUser) {
         throw new Error("poems/addPoem: could not add to author poem list");
      }

      console.log(gotPoem);

      return gotPoem;
   },

   /**
    * Gets poems taht have tagId in submittedTags
    * @param {string | ObjectId} tagId
    * @returns list of poem objects
    */
   async getPoemsByTagId(tagId) {
      tagId = validation.checkId(tagId, "Tag Id");

      const poemCollection = await poems();

      const poemList = await poemCollection
         .find({
            "submittedTags.tagId": new ObjectId(tagId),
         })
         .toArray();

      return poemList;
   },

   /**
    * Search poems by body
    * @param {string} searchStr
    * @returns list of poem objects
    */
   async searchByBody(searchStr) {
      searchStr = validation.checkString(searchStr, "Search string");
      let regex = new RegExp(searchStr, "i"); // things that contain this string, regardless of case
      const poemCollection = await poems();
      const poemList = await poemCollection
         .find({ body: { $regex: regex } })
         .toArray();
      return poemList;
   },

   /**
    * Remove a poem from the database
    *
    * @param {string} id
    * @returns
    */
   async removePoem(id) {
      id = validation.checkId(id, "Id");
      const poem = this.getPoemById(id);

      if (!poem) {
         throw new Error("removePoem: could not get poem");
      }

      const poemCollection = await poems();
      const deletionInfo = await poemCollection.findOneAndDelete({
         _id: new ObjectId(id),
      });
      if (deletionInfo.lastErrorObject.n === 0)
         throw new Error(`removePoem: Could not delete poem with id of ${id}`);

      return { ...deletionInfo.value, deleted: true };
   },

   /**
    *
    * @param {string} id
    * @param {Object} updatedPoem
    * @returns
    */
   async updatePoemPatch(id, updatedPoem) {
      // TODO validate as checking if there is a field
      id = validation.checkId(id, "Id");

      const updatedPoemData = {};
      if (updatedPoem.timeSubmitted) {
         updatedPoemData.timeSubmitted = updatedPoem.timeSubmitted; // TODO replace with validation
      }

      if (updatedPoem.title) {
         updatedPoemData.title = validation.checkString(
            updatedPoem.title,
            "Title"
         );
      }

      if (updatedPoem.body) {
         updatedPoemData.body = validation.checkString(
            updatedPoem.body,
            "Body"
         );
      }

      if (updatedPoem.userId) {
         updatedPoemData.userId = validation.checkId(
            updatedPoem.userId,
            "User Id"
         );
      }

      if (updatedPoem.link) {
         updatedPoemData.link = validation.checkUrl(updatedPoem.link, "Link");
      }

      if (updatedPoem.submittedTags) {
         updatedPoemData.submittedTags = updatedPoem.submittedTags; // TODO replace with validation
      }

      if (updatedPoem.totalTagCount) {
         updatedPoemData.totalTagCount = validation.checkNumber(
            updatedPoem.totalTagCount,
            "tagCount"
         );
      }

      if (updatedPoem.favoriteCount) {
         updatedPoemData.favoriteCount = validation.checkNumber(
            updatedPoem.favoriteCount,
            "favoriteCount"
         );
      }

      if (updatedPoem.comments) {
         updatedPoemData.comments = updatedPoem.comments; // TODO replace with validation
      }

      if (updatedPoem.private) {
         updatedPoemData.private = validation.checkBool(
            updatedPoem.private,
            "private"
         );
      }

      const poemCollection = await poems();
      let newPoem = await poemCollection.findOneAndUpdate(
         { _id: new ObjectId(id) },
         { $set: updatedPoemData },
         { returnDocument: "after" }
      );
      if (newPoem.lastErrorObject.n === 0)
         throw [404, `Could not update the poem with id ${id}`];

      return newPoem.value;
   },

   /**
    * Adds
    *
    * @param {string | ObjectId} poemId
    * @param {string | ObjectId} tagId
    */
   async addTag(poemId, tagId) {
      // TODO check that the tag exists in tags collection atleast in routing

      poemId = validation.checkId(poemId, "PoemId");
      tagId = validation.checkId(tagId, "TagId");
      const poemCollection = await poems();

      // Get the poem from the database and check it exists
      const poemFindQuery = { _id: new ObjectId(poemId) };
      const poem = await poemCollection.findOne(poemFindQuery);
      if (!poem) throw new Error(`addTag: no poem found with poemId ${poemId}`);

      // get submittedTag with tagId from the poem
      const submittedTag = await poem.submittedTags.find(
         (submittedTag) => submittedTag.tagId.toString() === tagId.toString()
      );

      // if the submittedTag does not exist, add a new submittedTag to the poem
      let updatedPoem;
      if (!submittedTag) {
         const pushSubmittedTagQuery = {
            $push: {
               submittedTags: {
                  _id: new ObjectId(),
                  tagId: new ObjectId(tagId),
                  tagCount: 1,
               },
            },
         };
         updatedPoem = await poemCollection.findOneAndUpdate(
            poemFindQuery,
            pushSubmittedTagQuery,
            { returnDocument: "after" }
         );
      } else {
         // if the submittedTag does exist just add one to the tag count
         const newTagCount = submittedTag.tagCount + 1;
         const find = {
            _id: new ObjectId(poemId),
            "submittedTags._id": submittedTag._id,
         };
         const update = {
            $set: {
               "submittedTags.$.tagCount": newTagCount,
            },
            $inc: { totalTagCount: 1 },
         };
         updatedPoem = await poemCollection.findOneAndUpdate(find, update, {
            returnDocument: "after",
         });
      }

      if (!updatedPoem) throw new Error("addTag: could not add the tag");
      updatedPoem = setTotalTagCount(poemId);
      return updatedPoem;
   },

   /**
    * Decreaese a submittedTags field by one in a poem
    *
    * @param {string | ObjectId} poemId
    * @param {string | ObjectId} tagId
    */
   async removeTag(poemId, tagId) {
      poemId = validation.checkId(poemId, "PoemId");
      tagId = validation.checkId(tagId, "TagId");
      const poemCollection = await poems();

      const findPoemQuery = { _id: new ObjectId(poemId) };
      const poem = await poemCollection.findOne(findPoemQuery);
      if (!poem)
         throw new Error(`removeTag: no poem found with poemId: ${poemId}`);

      // find the submitted tag
      const submittedTag = await poem.submittedTags.find(
         (submittedTag) => submittedTag.tagId.toString() === tagId
      );

      if (!submittedTag)
         throw new Error(
            `removeTag: no submittedTag with tagId ${tagId} found in poem ${poemId}`
         );

      let updatedPoem;
      if (submittedTag.tagCount > 1) {
         const newTagCount = submittedTag.tagCount - 1;

         updatedPoem = await poemCollection.findOneAndUpdate(
            {
               _id: new ObjectId(poemId),
               "submittedTags.tagId": new ObjectId(tagId),
            },
            {
               $set: { "submittedTags.$.tagCount": newTagCount },
            },
            { returnDocument: "after" }
         );
      } else {
         updatedPoem = await poemCollection.findOneAndUpdate(
            findPoemQuery,
            {
               $pull: { submittedTags: { tagId: new ObjectId(tagId) } },
            },
            { returnDocument: "after" }
         );
      }

      if (!updatedPoem)
         throw new Error(`removeTag: could not remove the submittedTag`);
      updatedPoem = setTotalTagCount(poemId);
      return updatedPoem;
   },

   /**
    * Search all poems by their title string
    *
    * @param {string} searchStr
    * @returns list of poem objects
    */
   async searchByTitle(searchStr) {
      searchStr = validation.checkString(searchStr, "Search string");
      let regex = new RegExp(searchStr, "i"); // things that contain this string, regardless of case
      const poemCollection = await poems();
      const poemList = await poemCollection
         .find({ title: { $regex: regex } })
         .toArray();
      return poemList;
   },

   /**
    * Gets the most popular poems based on total tag count
    * @returns list of poem objects
    */
   async getMostPopularPoems() {
      const poemCollection = await poems();
      let mostPopular = [];
      let cursor = await poemCollection
         .find()
         .sort({ totalTagCount: -1, _id: 1 })
         .limit(200);
      for await (const doc of cursor) {
         mostPopular.push(doc);
      }
      return mostPopular;
   },

   /**
    * Gets the most favorited poems
    * @returns list of poem objects
    */
   async getMostFavoritedPoems() {
      const poemCollection = await poems();
      let mostPopular = [];
      let cursor = await poemCollection
         .find()
         .sort({ favoriteCount: -1, _id: 1 })
         .limit(200);
      for await (const doc of cursor) {
         mostPopular.push(doc);
      }
      return mostPopular;
   },

   /**
    * Gets the most recent poems based on timeSubmitted
    * @returns list of poem objects
    */
   async getMostRecentPoems() {
      const poemCollection = await poems();
      let mostPopular = [];
      let cursor = await poemCollection
         .find()
         .sort({ timeSubmitted: -1, _id: 1 })
         .limit(200);
      for await (const doc of cursor) {
         mostPopular.push(doc);
      }
      return mostPopular;
   },
};

export default exportedMethods;

// import { dbConnection } from "../config/mongoConnection.js";
// const db = await dbConnection();
// console.log(
//    await exportedMethods.addTag(
//       "657c908ab14912562bcc452b",
//       "657c908ab14912562bcc453f"
//    )
// );

// console.log(await exportedMethods.searchByBody("off"));

// // console.log(await exportedMethods.getMostRecentPoems());
