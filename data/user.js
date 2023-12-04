// Import from installs
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// Import local functions
import { users } from '../config/mongoCollections.js'
import validation from '../helpers/validation.js'
import mongo from '../helpers/mongo.js'

let userCollection = await users();
const saltRounds = 16;

/**
 * Local helper function to handle id checks
 * 
 * @param {*} id - An ObjectId as either a string or the ObjectId itself
 * @returns String representation of the given id
 */
let checkId = (id) => {
    if (typeof id != "string" && !(id instanceof ObjectId)) {
        throw new Error("Input must be either a string or ObjectId")
    }
    id = validation.checkString(id.toString())
    return id
}

let updateUser = async (userId, updatedUserInfo) => {
    return await mongo.findOneAndUpdate(userCollection, userId, updatedUserInfo)
}

const exportedMethods = {

    /**
     * Get a user by their ID
     * 
     * @param {string|ObjectId} id - An ObjectId as either a string or the ObjectId itself
     * @returns The user object
     */
    async getById(id){
        id = checkId(id)
        return await userCollection.findOne({ _id: new ObjectId(id) });
    },

    /**
     * Search for all users who's usernames match the given string
     * 
     * @param {string} str - Search string
     * @returns - All users who's usernames contain the given string
     */
    async searchByUsername(str){
        str = validation.checkString(str)
        let regex = new RegExp(str, 'i'); // things that contain this string, regardless of case
        return await collection.find({ username: { $regex: regex }})
    },

    /**
     * Add a new user to the db
     * 
     * @param {string} username
     * @param {string} email 
     * @param {string} password 
     * @param {string} privacy 
     * @returns The ObjectId of the added user
     */
    async addUser (
        username,
        email,
        password,
        privacy
    ) {
        // All fields must be supplied
        if (!username || !email || !password || !privacy) {
            throw new Error("All fields must be supplied!")
        }
        
        // Validate all inputs
        username = validation.checkUsername(username)
        email = validation.checkEmail(email)
        password = validation.checkPassword(password)
        privacy = validation.checkPrivacy(privacy)

        // Username or Email should not already be in use
        if (await userCollection.findOne({ username: username })) {
            throw new Error(`Username '${username}' is already in use`);
        } else if (await userCollection.findOne({ email: email })) {
            throw new Error(`Email Address '${email}' is already in use`);
        }

        // Password must be hashed
        password = await bcrypt.hash(password, saltRounds)

        // Create a user with the provided information
        let newUser = {
            username: username,
            email: email,
            hashedPassword: password,
            timeAccountMade: new Date().toUTCString(),
            private: (privacy == "private"),
            bio: "",
            poemIds: [],
            taggedPoems: [],
            tagsUsed: [],
            favorites: [],
            recentlyViewedPoemIds: [],
            followers: [],
            following: []
        }
        const ack = await mongo.insertOne(userCollection, newUser)
        return ack.insertedId
    },

    /**
     * Deletes the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - An ObjectId as either a string or the ObjectId itself
     * @returns The deleted user
     */
    async deleteUser(id) {
        id = validation.checkId(id.toString())
        return await mongo.findOneAndDelete(userCollection, { _id: new ObjectId(id)} )
    },

    /**
     * 
     * @param {string|ObjectId} id - An ObjectId as either a string or the ObjectId itself  
     * @param {Object} taggedPoem - The tagged poem object
     * @returns The tagged poem ObjectId
     */
    async addTaggedPoem(id, taggedPoem) {
        // Validate the tagged poem


        // Check the Id and convert it to a string
        id = checkId(id)

        // Get the user by id and add the tagged poem to it
        let user = await this.getById(id)
        taggedPoem._id = new ObjectId()
        user.taggedPoems.push(taggedPoem)

        return await updateUser(user._id, user)
        
    }
}
export default exportedMethods;

let newUserId = await exportedMethods.addUser(
    "bkreiser",
    "bkreiser@duck.com",
    "Password@123",
    "private"
)

console.log(newUserId)

let updatedUser = await exportedMethods.addTaggedPoem(newUserId, {test:"hello"})
console.log(updatedUser)

//let deletedInfo = await exportedMethods.deleteUser(newUserId)
//console.log(deletedInfo)

