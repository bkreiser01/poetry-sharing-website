//Functions for tags
import * as connections from "../config/mongoConnection.js";
import { tags } from "../config/mongoCollections.js";
import exportedMethods from "../helpers/validation.js"
import { ObjectId } from "mongodb";



//Create new tag in Tags database
export const CreateNewTag = async (tagString, taggedPoemsId) => {
    //Validation
    let CheckedTag = exportedMethods.checkString(tagString, 'Tag text');
    let CheckedPoemsId = exportedMethods.checkId(taggedPoemsId, 'Poem ID');

    //Check that the poem exists

    //Connect
    const db = await connections.dbConnection();
    const tagCollection = await tags();

    //Create Tag
    const NewID = new ObjectId();
    const TagData = 
    {
        _id: NewID,
        tagString: CheckedTag,
        taggedPoemsId: [CheckedPoemsId],
    };

    //Insert tag
    await tagCollection.insertOne(TagData);
    return;
}



//Search for tag in Tags database
export const SearchForTag = async (tagString) => {
    //Validation
    let CheckedTag = exportedMethods.checkString(tagString, 'Tag text');

    //Connect
    const db = await connections.dbConnection();
    const tagCollection = await tags();

    //Search for tag
    let FoundTag = await tagCollection.findOne({tagString: CheckedTag});

    //Handle missing tag?

    return FoundTag;
}
