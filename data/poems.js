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


import { poems, users, tags } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../helpers/validation.js";

const exportedMethods = {
   /**
    * Get a poem by it's ID
    *
    * @param {string} id
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

      const poemCollection = await poems();
      const newPoemInsertInformation = await poemCollection.insertOne(newPoem);

      const newId = newPoemInsertInformation.insertedId;

      // TODO add poemid to user poemIds
      // const userCollection = await users();

      const gotPoem = await this.getPoemById(newId.toString());

      return gotPoem;
   },

   /**
    * Remove a poem from the database
    *
    * @param {string} id
    * @returns
    */
   async removePoem(id) {
      // TODO validate id
      id = validation.checkId(id);

      const poemCollection = await poems();
      const deletionInfo = await poemCollection.findOneAndDelete({
         _id: new ObjectId(id),
      });
      if (deletionInfo.lastErrorObject.n === 0)
         throw new Error(`Could not delete poem with id of ${id}`);

      // TODO remove poem from user poemIds, remove poem from all tags, and from user taggedPoemIds

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
            updatedPoem.totalTagCount
         );
      }

      if (updatedPoem.favoriteCount) {
         updatedPoemData.favoriteCount = validation.checkNumber(
            updatedPoem.favoriteCount
         );
      }

      if (updatedPoem.comments) {
         updatedPoemData.comments = updatedPoem.comments; // TODO replace with validation
      }

      if (updatedPoem.private) {
         updatedPoemData.private = validation.checkBool(updatedPoem.private);
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
    *
    * @param {string} poemId
    * @param {string} tagId
    */
   async addSubmittedTag(poemId, tagId) {
      poemId = validation.checkId(poemId, "PoemId");
      tagId = validation.checkId(tagId, "TagId");

      const poemCollection = await poems();

      // Get the poem from the database and check it exists
      const poem = await poemCollection.findOne({ _id: new ObjectId(poemId) });
      if (!poem) {
         throw new Error(
            `removeSubmittedTag: no poem found with poemId ${poemId}`
         );
      }

      // TODO check that the tag exists in tags collection

      // get submittedTag with tagId from the poem
      const submittedTag = await poem.submittedTags.find(
         (submittedTag) => submittedTag.tagId.toString() === tagId
      );

      // if the submittedTag does not exist, add a new submitteTag to the poem
      if (!submittedTag) {
         const updatedPoem = await poemCollection.findOneAndUpdate(
            { _id: new ObjectId(poemId) },
            {
               $push: {
                  _id: new ObjectId(),
                  tagId: new ObjectId(tagId),
                  tagCount: 1,
               },
               $inc: { totalTagCount: 1 },
            },
            { returnDocument: "after" }
         );

         if (updatedPoem === null)
            throw new Error("addSubmittedTag: could not add the submittedTag");
         return updatedPoem;
      }

      submittedTag.tagCount = submittedTag.tagCount + 1;

      // if the submittedTag does exist just add one to the tag count
      const updatedPoem = await poemCollection.findOneAndUpdate(
         { _id: new ObjectId(poemId), "submittedTags._id": submittedTag._id },
         {
            $set: {
               "submittedTags.$.tagCount": submittedTag.tagCount,
            },
            $inc: { totalTagCount: 1 },
         },
         { returnDocument: "after" }
      );

      if (updatedPoem === null) {
         throw new Error(
            `addSubmittedTag: could not increment the submittedTag`
         );
      }

      return updatedPoem;
   },

   /**
    * Decreaese a submittedTags field by one in a poem
    *
    * @param {string} poemId
    * @param {string} tagId
    */
   async decrementSubmittedTag(poemId, tagId) {
      poemId = validation.checkId(poemId, "PoemId");
      tagId = validation.checkId(tagId, "TagId");

      const poemCollection = await poems();
      const poem = await poemCollection.findOne({ _id: new ObjectId(poemId) });
      if (!poem) {
         throw new Error(
            `removeSubmittedTag: no poem found with poemId ${poemId}`
         );
      }

      const submittedTag = await poem.submittedTags.find(
         (submittedTag) => submittedTag.tagId.toString() === tagId
      );

      if (!submittedTag) {
         throw new Error(
            `removeSubmittedTag: no submittedTag with tagId ${tagId} found in poem ${poemId}`
         );
      }

      if (submittedTag.tagCount > 1) {
         submittedTag.tagCount = submittedTag.tagCount - 1;

         const updatedPoem = await poemCollection.findOneAndUpdate(
            { _id: new ObjectId(poemId), "submittedTags.tagId": tagId },
            {
               $set: { "submittedTags.$.tagCount": submittedTag.tagCount },
            },
            { returnDocument: "after" }
         );
         if (updatedPoem === null) {
            throw new Error(
               `removeSubmittedTag: could not remove the submittedTag`
            );
         }
         return updatedPoem;
      } else {
         const updatedPoem = await poemCollection.findOneAndUpdate(
            { _id: new ObjectId(poemId) },
            {
               $pull: { submittedTags: { tagId: tagId } },
            },
            { returnDocument: "after" }
         );
         if (updatedPoem === null) {
            throw new Error(
               `removeSubmittedTag: could not remove the submittedTag`
            );
         }
         return updatedPoem;
      }

      // check if he in there, if he in there just add one to tagCount
      // otherwise
   },

   /**
    * Search all poems by their title string
    *
    * @param {string} searchStr
    */
   async searchByTitle(searchStr) {
      searchStr = validation.checkString(searchStr, "Search string");
      let regex = new RegExp(searchStr, "i"); // things that contain this string, regardless of case
      const poemCollection = await poems();
      return await poemCollection.find({ title: { $regex: regex } });
   },
};

export default exportedMethods;
