/**
 * Contains all functions that interact with the tags collection
 *
 * @module data/tags
 *
 * The tag document contains the following fields
 *    _id: ObjectId
 *    tagString: string
 *    taggedPoemsId: array of object ids
 */

import * as connections from "../config/mongoConnection.js";
import { tags } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../helpers/validation.js";

const tagCollection = await tags();

const exportedMethods = {
   /**
    * Returns tag object according to id
    *
    * @param {string} tagId
    */
   async getTagById(tagId) {
      tagId = validation.checkId(tagId);

      const tag = await tagCollection.findOne({ _id: new ObjectId(tagId) });
      if (!tag) throw new Error("getTabById: Could not get tag");

      return tag;
   },

   /**
    * Adds a tag to a poem, inserts a tag if the tag does not exist yet
    *
    * @param {string} tagString
    * @param {string} poemId
    */
   async addTag(tagString, poemId) {
      // Validation
      tagString = validation.checkTagString(tagString);
      poemId = validation.checkId(poemId);

      // check that the tag does not already exist
      const findInfoTagString = await tagCollection
         .find({
            tagString: { $eq: tagString },
         })
         .toArray();

      // if there's no tag with that string, add one
      if (findInfoTagString.length < 1) {
         // Insert new tag
         const newTag = {
            tagString: tagString,
            taggedPoemsId: [new ObjectId(poemId)],
         };
         const insertInfo = await tagCollection.insertOne(newTag);

         if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw new Error("addTag: could not add tag");
         }
         return newTag;
      }

      // check if the poem is already in the tag
      const findInfoPoemId = await tagCollection
         .find({
            poemId: { $eq: new Object(poemId) },
         })
         .toArray();
      if (findInfoPoemId.length > 0) {
         // might want different behavior here
         throw new Error("addTag: tag already assigned to this poem");
      }

      const updatedTag = tagCollection.findOneAndUpdate(
         { tagString: tagString },
         {
            $push: { taggedPoemsId: new ObjectId(poemId) },
         }
      );

      if (!updatedTag) {
         throw new Error("addTag: Could not add poemId to taggedPoemsId");
      }

      return updatedTag;
   },

   /**
    * Search's for a tag by it's name
    * @param {string} searchStr
    * @returns {Array.<Object>}
    */
   async searchTagByName(searchStr) {
      searchStr = validation.checkString(searchStr);

      let retVal = [];
      retVal.push(
         await tagCollection
            .find({ tagString: { $regex: searchStr, $options: "i" } })
            .toArray()
      );
      retVal = retVal.flat(Infinity);

      return retVal;
   },

   /**
    * deletes a poem from all tags
    * @param {string} poemId 
    * @returns 
    */
   async deletePoemFromAllTags(poemId) {
      poemId = validation.checkId(poemId);

      const updateInfo = await tagCollection
         .updateMany(
            {},
            {
               $pull: { taggedPoemsId: { $eq: new ObjectId(poemId) } },
            }
         );

      return updateInfo;
   },
};

const db = await connections.dbConnection();
await exportedMethods.deletePoemFromAllTags("aaaaaaaaaaaaaaaaaaaaaaa0");
