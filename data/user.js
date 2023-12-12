/**
 * This file contains all the functions that interact with the user collection
 * 
 * @module data/user
 * 
 * The user collection contains the following fields:
 *      - username: string
 *      - email: string
 *      - hashedPassword: string
 *      - timeAccountMade: string
 *      - private: boolean
 *      - bio: string
 *      - poemIds: array of ObjectIds
 *      - taggedPoems: array of tagged poem objects
 *      - tagsUsed: array of strings
 *      - favorites: array of ObjectIds
 *      - recentlyViewedPoemIds: array of ObjectIds
 *      - followers: array of ObjectIds
 *      - following: array of ObjectIds
 * 
 * The tagged poem object contains the following fields:
 *     - poemId: ObjectId
 *     - taggedBy: ObjectId
 *     - taggedAt: string
 *     - taggedText: string
 * 
 */

// Package Imports
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// Local Imports
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

/**
 * Local helper function to update a user
 * 
 * @param {*} userId - The ObjectId of the user to update 
 * @param {*} updatedUserInfo - The updated user info
 * @returns the updated user object
 */
let updateUser = async (userId, updatedUserInfo) => {
    return await mongo.findOneAndUpdate(userCollection, userId, updatedUserInfo)
}
/**
 * Local helper function to get a user by id
 * 
 * @param {string|ObjectId} id - An ObjectId as either a string or the ObjectId itself
 * @returns the requested user object
 */
let getById = async (id) => {
    id = checkId(id)
    return await userCollection.findOne({ _id: new ObjectId(id) });
}

const exportedMethods = {
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
     * @param {string|ObjectId} id - The ObjectId of the user to delete
     * @returns The deleted user
     */
    async deleteUser(id) {
        id = validation.checkId(id.toString())
        return await mongo.findOneAndDelete(userCollection, { _id: new ObjectId(id)} )
    },

    /**
     * Updates the username of the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string} newUsername - The new username
     * @returns the updated user object
     */
    async updateUsername(id, newUsername) {
        // Validate the new username
        newUsername = validation.checkUsername(newUsername)

        // Check the Id and convert it to a string
        id = checkId(id)

        // Get the user by id and update the username
        let user = await getById(id)
        user.username = newUsername

        return await updateUser(user._id, user)
    },

    /**
     * Updates the email of the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {*} newEmail - The new email
     * @returns the updated user object
     */
    async updateEmail(id, newEmail) {
        // Validate the new email
        newUsername = validation.checkEmail(newEmail)

        // Check the Id and convert it to a string
        id = checkId(id)

        // Get the user by id and update the username
        let user = await getById(id)
        user.email = newEmail

        return await updateUser(user._id, user)
    },

    /**
     * Updates the password of the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update 
     * @param {*} newPassword - The new password
     * @returns the updated user object
     */
    async updatePassword(id, newPassword) {
        // Validate the new password
        newPassword = validation.checkPassword(newPassword)

        // Check the Id and convert it to a string
        id = checkId(id)

        // Get the user by id and update the password
        let user = await getById(id)
        user.hashedPassword = await bcrypt.hash(newPassword, saltRounds)

        return await updateUser(user._id, user)
    },

    /**
     *  Updates the privacy setting of the user with the given ObjectId
     * 
     * @param {string} id - The ObjectId of the user to update
     * @param {string} newPrivacy - The new privacy setting
     * @returns the updated user object
     */
    async updatePrivacy(id, newPrivacy) {
        // Validate the new privacy
        newPrivacy = validation.checkPrivacy(newPrivacy)

        // Check the Id and convert it to a string
        id = checkId(id)

        // Get the user by id and update the privacy
        let user = await getById(id)
        user.private = (newPrivacy == "private")

        return await updateUser(user._id, user)
    },

    /**
     *  Updates the bio of the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string} newBio - The new bio
     * @returns the updated user object
     */
    async updateBio(id, newBio) {
        // Validate the new bio
        newBio = validation.checkString(newBio)

        // Check the Id and convert it to a string
        id = checkId(id)

        // Get the user by id and update the bio
        let user = await getById(id)
        user.bio = newBio

        return await updateUser(user._id, user)
    },

    /**
     *  Adds a poem to the user with the given ObjectId
     * 
     * @param {string|ObjectId} userId - The ObjectId of the user to update
     * @param {string|ObjectId} poemId - The ObjectId of the poem to add 
     * @returns the updated user object
     */
    async addPoem(userId, poemId) {
        // Check the Id and convert it to a string
        userId = checkId(userId)
        poemId = checkId(poemId)

        // Get the user by id and add the poem to it
        let user = await getById(userId)
        user.poemIds.push(poemId)

        return await updateUser(user._id, user)
    },

    /**
     *  Delete a poem from the user with the given ObjectId
     * 
     * @param {string|ObjectId} userId - The ObjectId of the user to update 
     * @param {string|ObjectId} poemId - The ObjectId of the poem to delete
     * @returns the updated user object
     */
    async deletePoem(userId, poemId) {
        // Check the Id and convert it to a string
        userId = checkId(userId)
        poemId = checkId(poemId)

        // Get the user by id and remove the poem from it
        let user = await getById(userId)
        user.poemIds = user.poemIds.filter((poem) => poem != poemId)

        return await updateUser(user._id, user)
    },

    /**
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update 
     * @param {Object} taggedPoem - The tagged poem object
     * @returns the updated user object
     */
    async addTaggedPoem(id, taggedPoem) {
        // Validate the tagged poem


        // Check the Id and convert it to a string
        id = checkId(id)

        // Get the user by id and add the tagged poem to it
        let user = await getById(id)
        taggedPoem._id = new ObjectId()
        user.taggedPoems.push(taggedPoem)

        return await updateUser(user._id, user)
    },

    /**
     *  Deletes the tagged poem of a certain ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|Object} taggedPoemId - The Object Id of the tagged poem to remove
     * @returns the updated user object
     */
    async deleteTaggedPoem(id, taggedPoemId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        taggedPoemId = checkId(taggedPoemId)

        // Get the user by id and remove the tagged poem from it
        let user = await getById(id)
        user.taggedPoems = user.taggedPoems.filter((taggedPoem) => taggedPoem._id != taggedPoemId)

        return await updateUser(user._id, user)
    },

    /**
     *  Adds a tag to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} tagId - The ObjectId of the tag to add
     * @returns the updated user object
     */
    async addTagUsed(id, tagId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        tagId = checkId(tagId)

        // Get the user by id and add the tag to it
        let user = await getById(id)
        user.tagsUsed.push(tagId)

        return await updateUser(user._id, user)
    },

    /**
     *  Deletes a tag from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} tagId - The ObjectId of the tag to delete
     * @returns the updated user object
     */
    async deleteTagUsed(id, tagId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        tagId = checkId(tagId)

        // Get the user by id and remove the tag from it
        let user = await getById(id)
        user.tagsUsed = user.tagsUsed.filter((tag) => tag != tagId)

        return await updateUser(user._id, user)
    },

    /**
     *  Adds a favorite poem to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} poemId - The ObjectId of the poem to add
     * @returns the updated user object
     */
    async addFavorite(id, poemId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        poemId = checkId(poemId)

        // Get the user by id and add the poem to it
        let user = await getById(id)
        user.favorites.push(poemId)

        return await updateUser(user._id, user)
    },

    /**
     *  Deletes a favorite poem from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} poemId - The ObjectId of the poem to delete
     * @returns the updated user object
     */
    async deleteFavorite(id, poemId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        poemId = checkId(poemId)

        // Get the user by id and remove the poem from it
        let user = await getById(id)
        user.favorites = user.favorites.filter((poem) => poem != poemId)

        return await updateUser(user._id, user)
    },

    /**
     *  Adds a follower to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} poemId - The ObjectId of the poem to add
     * @returns the updated user object
     */
    async addRecentlyViewedPoem(id, poemId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        poemId = checkId(poemId)

        // Get the user by id and add the poem to it
        let user = await getById(id)
        user.recentlyViewedPoemIds.push(poemId)

        return await updateUser(user._id, user)
    },

    /**
     *  Deletes a recently viewed poem from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} poemId - The ObjectId of the poem to delete
     * @returns the updated user object
     */
    async deleteRecentlyViewedPoem(id, poemId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        poemId = checkId(poemId)

        // Get the user by id and remove the poem from it
        let user = await getById(id)
        user.recentlyViewedPoemIds = user.recentlyViewedPoemIds.filter((poem) => poem != poemId)

        return await updateUser(user._id, user)
    },

    /**
     * Adds a follower to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} followerId - The ObjectId of the follower to add
     * @returns the updated user object
     */
    async addFollower(id, followerId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        followerId = checkId(followerId)

        // Get the user by id and add the follower to it
        let user = await getById(id)
        user.followers.push(followerId)

        return await updateUser(user._id, user)
    },

    /**
     *  Deletes a follower from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} followerId - The ObjectId of the follower to delete
     * @returns the updated user object
     */
    async deleteFollower(id, followerId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        followerId = checkId(followerId)

        // Get the user by id and remove the follower from it
        let user = await getById(id)
        user.followers = user.followers.filter((follower) => follower != followerId)

        return await updateUser(user._id, user)
    },

    /**
     * Adds a following to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} followingId - The ObjectId of the following to add
     * @returns the updated user object
     */
    async addFollowing(id, followingId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        followingId = checkId(followingId)

        // Get the user by id and add the follower to it
        let user = await getById(id)
        user.following.push(followingId)

        return await updateUser(user._id, user)
    },

    /**
     * Deletes a following from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} followingId - The ObjectId of the following to delete
     * @returns the updated user object
     */
    async deleteFollowing(id, followingId) {
        // Check the Id and convert it to a string
        id = checkId(id)
        followingId = checkId(followingId)

        // Get the user by id and remove the follower from it
        let user = await getById(id)
        user.following = user.following.filter((following) => following != followingId)

        return await updateUser(user._id, user)
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
     * Login a user
     * 
     * @param {string} username - The username of the user to get
     * @param {string} password - The password of the user to get
     */
    async login(username, password) {
        // Validate the username and password
        username = validation.checkUsername(username)
        password = validation.checkPassword(password)

        // Get the user by username
        let user = await userCollection.findOne({ username: username })
        if (!user) {
            throw new Error("Invalid username or password")
        }

        // Check the password
        if (!(await bcrypt.compare(password, user.hashedPassword))) {
            throw new Error("Invalid username or password")
        }

        return user
    },
}
export default exportedMethods;

// console.log(await exportedMethods.addUser(
//     "bkreiser",
//     "bkreiser@duck.com",
//     "Password@01",
//     "public"
// ))