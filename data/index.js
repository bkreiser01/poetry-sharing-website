// Amalgamate data functions
import * as connections from "./mongoConnection.js";
import { tags } from "./mongoCollections.js";
import { ObjectId } from "mongodb";

//Create new tag in Tags database
export const CreateNewTag = async (tagString, taggedPoemsId) => {
    //Validate here

    //Connect
    const db = await connections.dbConnection();
    const tagCollection = await tags();

    //Create Tag
    const NewID = new ObjectId("bbbbbbbbbbbbbbbbbbbbbbb0");
    const seedTagData = 
    {
        _id: NewID,
        tagString: tagString,
        taggedPoemsId: taggedPoemsId,
    }

    //Insert tag and close
    await tagCollection.insertOne(seedTagData);
    await connections.closeConnection();
    return;
}