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

/* Function descriptions:
 * 
 * getTagById:
 * Return tag object associated with given id
 *
 * getTagByName:
 * Return a tag object associated with given name string
 * 
 * createNewTag:
 * Create a new tag and return its id (does not associate this tag with any poems)
 * 
 * addTagToPoem:
 * Update data to associate a poem with a tag
 * 
 * deletePoemFromAllTags:
 * Delete a poem from all tags
*/

import { tags } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../helpers/validation.js";

const tagCollection = await tags();



const exportedMethods = {
   /**
    * Return tag object associated with given id
    *
    * @param {string} tagId
    * @returns {Array.<Object>}
   */
   async getTagById(tagId) {
      //Validation
      tagId = validation.checkId(tagId, "Tag id");

      //Get tag
      const foundTag = await tagCollection.findOne({ _id: new ObjectId(tagId) });
      if (!foundTag) throw new Error("getTagById: Tag not found");

      return foundTag;
   },



   /**
    * Return a tag object associated with given name string
    * @param {string} tagString
    * @returns {Array.<Object>}
   */
   async getTagByName(tagString) {
      //Validation
      tagString = validation.checkTagString(tagString, "Tag string");

      //Get tag
      const foundTag = await tagCollection.findOne({ tagString: tagString });
      if (!foundTag) throw new Error("getTagByName: Tag not found");

      return foundTag;
   },



   /**
    * Create a new tag and return its id (does not associate this tag with any poems)
    * 
    * @param {string} tagString
    * @returns {string}
   */
   async createNewTag(tagString) {
      //Validation
      tagString = validation.checkTagString(tagString, "Tag string");

      //Check if tag already exists
      try{
         let existingTag = await this.getTagByName(tagString);
         if (existingTag) return existingTag;
      } catch (e){
         if(e.message !== "getTagByName: Tag not found") throw e;
      }
      
      //Create tag
      let newTag = {
         tagString: tagString,
         taggedPoemsId: [],
      };

      //Insert tag
      let insertedTag = await tagCollection.insertOne(newTag);
      if (!insertedTag.acknowledged || !insertedTag.insertedId) {
         throw new Error("createNewTag: Could not insert tag to database");
      }
      
      return insertedTag.insertedId.toString();
   },



   /**
    * Update data to associate a poem with a tag
    * 
    * @param {string} tagString
    * @param {string} poemId
   */
   async addTagToPoem(tagString, poemId) {
      //Validation
      tagString = validation.checkTagString(tagString, "Tag string");
      poemId = validation.checkId(poemId, "Poem id");

      //Check if tag already exists
      let existingTag;
      try{
         existingTag = await this.getTagByName(tagString);
      } catch (e){
         if(e.message !== "getTagByName: Tag not found") throw e;
      }

      //If tag does not exist, create it
      if (!existingTag) {
         let createdTag = await this.createNewTag(tagString);
         existingTag = await this.getTagById(createdTag);
      }

      //Check if poem is alrady associated with tag
      let poemsArray = existingTag.taggedPoemsId;
      for(let i = 0; i < poemsArray.length; i++){
         if(poemsArray[i] == poemId){
            //Might want different behavior here:
            throw new Error("addTagToPoem: Tag already assigned to poem");  
         }
      }

      //Add tag to poem
      let updatedTag = await tagCollection.findOneAndUpdate(
         { tagString: tagString },
         {$push: { taggedPoemsId: new ObjectId(poemId) },}
      );
      if(!updatedTag) throw new Error("addTagToPoem: Could not add poemId to taggedPoemsId");

      return updatedTag
   },




   /**
    * DEPRECATED: DO NOT USE
    * Search for a tag using its name string
    * @param {string} searchStr
    * @returns {Array.<Object>}
   */
   async searchTagByName(searchStr) {
      searchStr = validation.checkString(searchStr);

      const tagCollection = await tags();
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
    * Delete a poem from all tags
    * @param {string} poemId
    * @returns
   */
   async deletePoemFromAllTags(poemId) {
      //Validation
      poemId = validation.checkId(poemId, "Poem id");

      //Delete poem
      const deletedPoem = await tagCollection.updateMany(
         {},
         {
            $pull: { taggedPoemsId: { $eq: new ObjectId(poemId) } },
         }
      );
      if(!deletedPoem) throw new Error("deletePoemFromAllTags: Could not delete poemId from taggedPoemsId");

      return deletedPoem;
   },
};

export default exportedMethods