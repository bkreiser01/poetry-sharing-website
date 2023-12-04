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

    //Search for tag and return
    let FoundTag = await tagCollection.findOne({tagString: inputTagString});
    return FoundTag;
}
