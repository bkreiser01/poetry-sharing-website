//Functions for tags
import * as connections from "../config/mongoConnection.js";
import { tags } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";



//Create new tag in Tags database
export const CreateNewTag = async (tagString, taggedPoemsId) => {
    //Validate here

    //Connect
    const db = await connections.dbConnection();
    const tagCollection = await tags();

    //Create Tag
    const NewID = new ObjectId();
    const seedTagData = 
    {
        _id: NewID,
        tagString: tagString,
        taggedPoemsId: [taggedPoemsId],
    };

    //Insert tag
    await tagCollection.insertOne(seedTagData);
    return;
}



//Search for tag in Tags database
export const SearchForTag = async (inputTagString) => {
    //Validate here

    //Connect
    const db = await connections.dbConnection();
    const tagCollection = await tags();

<<<<<<< Updated upstream
    //Search for tag and return
    let FoundTag = await tagCollection.findOne({tagString: inputTagString});
    return FoundTag;
}
=======
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
};

export default exportedMethods
>>>>>>> Stashed changes
