import { poems, users, tags } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "../helpers/validation.js";

const exportedMethods = {
   async getPoemById(id) {
      id = validation.checkId(id, "id");

      const poemCollection = await poems();
      const poem = await poemCollection.findOne({ _id: new ObjectId(id) });

      if (!poem) throw new Error("Error: Poem not found");
      return poem;
   },

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

      console.log(newPoemInsertInformation);

      const newId = newPoemInsertInformation.insertedId;

      // TODO add poemid to user poemIds
      // const userCollection = await users();

      const gotPoem = await this.getPoemById(newId.toString());
      console.log(gotPoem);

      return gotPoem;
   },

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

   async updatePoemPatch(id, updatedPoem) {
      // TODO validate as checking if there is a field

      const updatedPoemData = {};
      if (updatedPoem.timeSubmitted) {
         updatedPoemData.timeSubmitted = updatedPoem.timeSubmitted; // TODO replace with validation
      }

      if (updatedPoem.title) {
         updatedPoemData.title = validation.checkString(updatedPoem.title, "Title"); 
      }

      if (updatedPoem.body) {
         updatedPoemData.body = validation.checkString(updatedPoem.body, "Body"); 
      }

      if (updatedPoem.userId) {
         updatedPoemData.userId = validation.checkId(updatedPoem.userId, "User Id"); 
      }

      if (updatedPoem.link) {
         updatedPoemData.link = validation.checkUrl(updatedPoem.link, "Link"); 
      }

      if (updatedPoem.submittedTags) {
         updatedPoemData.submittedTags = updatedPoem.submittedTags; // TODO replace with validation
      }

      if (updatedPoem.totalTagCount) {
         updatedPoemData.totalTagCount = validation.checkNumber(updatedPoem.totalTagCount);
      }

      if (updatedPoem.favoriteCount) {
         updatedPoemData.favoriteCount = validation.checkNumber(updatedPoem.favoriteCount); 
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
      const poem = await poemCollection.findOne({ _id: new ObjectId(poemId) });

      // check if he in there, if he in there just add one to tagCount
      // otherwise
   },
};

export default exportedMethods;
