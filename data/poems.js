// Data functions for poems collection.

/*
Poem Structure
================================
timeSubmitted, title, body, userId, link, private
{
"_id": "65527c85f01cb3df23a70f44",
"timeSubmitted": "Mon Nov 13 2023 14:44:59 GMT-0500 (Eastern Standard Time)",
"title": "Stopping by Woods on a Snowy Evening",
"body": "Whose woods these are I think I know.\
His house is in the village though;\
He will not see me stopping here\
To watch his woods fill up with snow.",
"userId": "65527d6d94db47ccb90e4aad",
"link": "https://www.youtube.com/watch?v=1sWcq2-ZA5o",
"submittedTags": [{
      "_id": "655282f2bb7f190bd72ac0c8",
      "tagId": "65527f7fb958bc36a3d7ddb0",
      "tagCount": 3
   },
   {
      "_id": "65528361faad43776ec0be91",
      "tagId": "65528366291f2682fb635953",
      "tagCount": 2
   }],
"totalTagCount": 5,
"favoriteCount": 2,
"comments": [{
      "_id": "6552843a1d44565f0746063d",
      "tagId": "65527f7fb958bc36a3d7ddb0",
      "userId": "65528444d391b6fd72cc1237",
      "timeCommented": "Mon Nov 13 2023 14:58:40 GMT-0500 (Eastern Standard Time)",
      "commentString": "Yeah lol super funny!",
      "replies": []
   }],
"private": false 
}
*/

import { poems } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../validation.js";

const exportedMethods = {
   async getPoemById(id) {
      id = validation.checkId(id, "id");

      const poemCollection = await poems();
      const poem = await poemCollection.findOne({ _id: ObjectId(id) });

      if (!poem) throw "Error: Poem not found";
      return poem;
   },

   async addPoem(timeSubmitted, title, body, userId, link, priv) {
      // TODO input validation
      const untitledString = "Untitled";

      if (!title) {
         title = untitledString;
      }
      if (!link) {
         link = "";
      }

      const newPoem = {
         timeSubmitted: timeSubmitted, // TODO validate time here
         title: validation.checkString(title), // TODO validate string here
         body: body,
         userId: validation.checkId(userId),
         link: link,
         submittedTags: [],
         totalTagCount: 0,
         favoriteCount: 0,
         comments: [],
         private: priv,
      };

      const poemCollection = await poems();
      const newInsertInformation = await poemCollection.insertOne(newPoem);
      const newId = newInsertInformation.insertedId;

      // TODO add poemid to user poemIds

      return await this.getPostById(newId.toString());
   },

   async removePoem(id) {
      // TODO validate id

      const poemCollection = await poems();
      const deletionInfo = await poemCollection.findOneAndDelete({
         _id: ObjectId(id),
      });
      if (deletionInfo.lastErrorObject.n === 0)
         throw [404, `Could not delete poem with id of ${id}`];

      // TODO remove poem from user poemIds, remove poem from all tags, and from user taggedPoemIds

      return { ...deletionInfo.value, deleted: true };
   },

   async updatePoemPut(id, updatedPoem) {
      // TODO Validate each field in updatedPoem

      let originalPoem = await this.getPoemById(id);
      let updatedPoemData = {
         timeSubmitted: updatedPoem.timeSubmitted,
         title: updatedPoem.title,
         body: updatedPoem.body,
         userId: updatedPoem.userId,
         liink: updatedPoem.link,
         submittedTags: originalPoem.submittedTags,
         totalTagCount: originalPoem.totalTagCount,
         favoriteCount: originalPoem.favoriteCount,
         comments: originalPoem.comments,
         private: updatedPoem.private,
      };

      const poemCollection = await poems();
      const updateInfo = await poemCollection.findOneAndReplace(
         { _id: ObjectId(id) },
         updatedPoemData,
         { returnDocument: "after" }
      );

      if (updateInfo.lastErrorObject.n === 0)
         throw [
            404,
            `Error: Update failed! Could not update poem with id ${id}`,
         ];
      return updateInfo.value;
   },

   async updatePoemPatch(id, updatedPoem) {
      // TODO validate as checking if there is a field

      const updatedPoemData = {};
      if (updatedPoem.timeSubmitted) {
         updatedPoemData.timeSubmitted = updatedPoem.timeSubmitted; // TODO replace with validation
      }

      if (updatedPoem.title) {
         updatedPoemData.title = updatedPoem.title; // TODO replace with validation
      }

      if (updatedPoem.body) {
         updatedPoemData.body = updatedPoem.body; // TODO replace with validation
      }

      if (updatedPoem.userId) {
         updatedPoemData.userId = updatedPoem.userId; // TODO replace with validation
      }

      if (updatedPoem.link) {
         updatedPoemData.link = updatedPoem.link; // TODO replace with validation
      }

      if (updatedPoem.submittedTags) {
         updatedPoemData.submittedTags = updatedPoem.submittedTags; // TODO replace with validation
      }

      if (updatedPoem.totalTagCount) {
         updatedPoemData.totalTagCount = updatedPoem.totalTagCount; // TODO replace with validation
      }

      if (updatedPoem.favoriteCount) {
         updatedPoemData.favoriteCount = updatedPoem.favoriteCount; // TODO replace with validation
      }

      if (updatedPoem.comments) {
         updatedPoemData.comments = updatedPoem.comments; // TODO replace with validation
      }

      if (updatedPoem.private) {
         updatedPoemData.private = updatedPoem.private; // TODO replace with validation
      }

      const poemCollection = await poems();
      let newPoem = await poemCollection.findOneAndUpdate(
         { _id: ObjectId(id) },
         { $set: updatedPoemData },
         { returnDocument: "after" }
      );
      if (newPoem.lastErrorObject.n === 0)
         throw [404, `Could not update the poem with id ${id}`];

      return newPoem.value;
   },

   async addSubmittedTag(poemId, tagId) {
      // TODO validate tagId
      const poemCollection = await poems();
      const poem = await poemCollection.findOne({ _id: ObjectId(poemId) });

      // check if he in there, if he in there just add one to tagCount
      // otherwise
   },

   async removeSubmittedTag(poemId, tagId) {
      // TODO validate tagId
      const poemCollection = await poems();
      const poem = await poemCollection.findOne({ _id: ObjectId(poemId) });

      // check if he in there, if he in there just add one to tagCount
      // otherwise
   },
};

export default exportedMethods;
