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
 *     - poemId: ObjectId
 *     - tagIds: array of ObjectIds
 * 
 */

// Package Imports
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// Local Imports
import { users } from '../config/mongoCollections.js'
import validation from '../helpers/validation.js'
import mongo from '../helpers/mongo.js'
import tagsData from './tags.js';
import poemsData from './poems.js';

let userCollection = await users();
const saltRounds = 1;

/**
 * Local helper function to handle id checks
 * 
 * @param {*} id - An ObjectId as either a string or the ObjectId itself
 * @returns the given ObjectId
 */
let checkId = (id) => {
    if (typeof id != "string" && !(id instanceof ObjectId)) {
        throw new Error("Input must be either a string or ObjectId")
    }
    id = validation.checkString(id.toString())
    return new ObjectId(id)
}

let idIsIn = (elem, arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].toString() == elem.toString()) {
            return true
        }
    }
    return false
}

let removeIdFromArray = (elem, arr) => {
    let retVal = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].toString() != elem.toString()) {
            retVal.push(arr[i])
        }
    }
    return retVal
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

let addIdToUserField = async(userId, idToAdd, field) => {
    userId = checkId(userId)
    idToAdd = checkId(idToAdd)

    let user = await exportedMethods.getById(userId)

    if (idIsIn(idToAdd, user[field])) {
        throw new Error(`User already has an instance of '${idToAdd.toString()}' in '${field}'!`)
    }

    user[field].push(idToAdd)

    return await updateUser(user._id, user)
}

let deleteIdFromUserField = async(userId, idToDelete, field) => {
    // Check the Id and convert it to a string
    userId = checkId(userId)
    idToDelete = checkId(idToDelete)

    // Get the user by id and remove the poem from it
    let user = await exportedMethods.getById(userId)
    user[field] = removeIdFromArray(idToDelete, user[field])

    return await updateUser(user._id, user)
}

const exportedMethods = {
    /**
     * Get a user by id
     * 
     * @param {string|ObjectId} id - An ObjectId as either a string or the ObjectId itself
     * @returns the requested user object
     */
    async getById(id) {
        id = checkId(id)
        let foundUser = await userCollection.findOne({ _id: new ObjectId(id) })

        if (!foundUser) {
            throw new Error(`No user with id '${id}'!`)
        }
        return foundUser;
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
        username = validation.checkUsername(username).toLowerCase()
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
            timeAccountMade: new Date(),
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

        if(await userCollection.findOne({ username: newUsername })) {
            throw new Error("Username is already in use!")
        }

        // Get the user by id and update the username
        let user = await exportedMethods.getById(id)
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
        newEmail = validation.checkEmail(newEmail)

        // Check the Id and convert it to a string
        id = checkId(id)

        // Verify that the email is not already in use
        if(await userCollection.findOne({ email: newEmail })) {
            throw new Error("Email is already in use!")
        }

        // Get the user by id and update the username
        let user = await exportedMethods.getById(id)
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
        let user = await exportedMethods.getById(id)
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
        let user = await exportedMethods.getById(id)
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
        let user = await exportedMethods.getById(id)
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
        return await addIdToUserField(userId, poemId, "poemIds")
    },

    /**
     *  Delete a poem from the user with the given ObjectId
     * 
     * @param {string|ObjectId} userId - The ObjectId of the user to update 
     * @param {string|ObjectId} poemId - The ObjectId of the poem to delete
     * @returns the updated user object
     */
    async deletePoem(userId, poemId) {
        return await deleteIdFromUserField(userId, poemId, "poemIds")
    },

    /**
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update 
     * @param {Object} taggedPoem - The tagged poem object
     * @returns the updated user object
     */
    async addTaggedPoem(id, taggedPoem) {
        taggedPoem = validation.checkTaggedPoem(taggedPoem)
        id = checkId(id)

        let user = await exportedMethods.getById(id)

        for (let i = 0; i < user.taggedPoems.length; i++) {
            if (user.taggedPoems[i]._id.toString() == taggedPoem._id.toString()) {
                throw new Error(`User already has a tagged poem with that id!`)
            }
        }

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
        taggedPoemId = checkId(taggedPoemId)
        id = checkId(id)

        let user = await exportedMethods.getById(id)

        let newTaggedPoems = []
        for (let i = 0; i < user.taggedPoems.length; i++) {
            console.log(user.taggedPoems[i]._id.toString() )
            if (user.taggedPoems[i]._id.toString() != taggedPoemId.toString()) {
                newTaggedPoems.push(user.taggedPoems[i])
            }
        }
        
        user.taggedPoems = newTaggedPoems

        return await updateUser(user._id, user)
    },

    /**
     * Deletes the tagged poem of a certain ObjectId for all users
     * @param {string|ObjectId} poemId - The ObjectId of the poem to delete
     */
    async deleteTaggedPoemForAllUsers(poemId) {
        // Get all user ids
        let userIds = await userCollection.distinct('_id')

        // Get each user and remove the tagged poem from it
        for (let i = 0; i < userIds.length; i++) {
            let newTaggedPoems = []
            let user = await exportedMethods.getById(userIds[i])

            for (let j = 0; j < user.taggedPoems.length; j++) {
                if (user.taggedPoems[j].poemId.toString() != poemId.toString()) {
                    newTaggedPoems.push(user.taggedPoems[j])
                }
            }
            user.taggedPoems = newTaggedPoems
            await updateUser(user._id, user)
        }
    },

    /**
     *  Adds a tag to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} tagId - The ObjectId of the tag to add
     * @returns the updated user object
     */
    async addTagUsed(id, tagId) {
        return await addIdToUserField(id, tagId, "tagsUsed")
    },

    /**
     *  Deletes a tag from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} tagId - The ObjectId of the tag to delete
     * @returns the updated user object
     */
    async deleteTagUsed(id, tagId) {
        return await deleteIdFromUserField(id, tagId, "tagsUsed")
    },

    /**
     *  Adds a favorite poem to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} poemId - The ObjectId of the poem to add
     * @returns the updated user object
     */
    async addFavorite(id, poemId) {
        return await addIdToUserField(id, poemId, "favorites")
    },

    /**
     *  Deletes a favorite poem from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} poemId - The ObjectId of the poem to delete
     * @returns the updated user object
     */
    async deleteFavorite(id, poemId) {
        return await deleteIdFromUserField(id, poemId, "favorites")
    },

    /**
     * Delete a favorite poem from all users
     * @param {string|ObjectId} poemId - The ObjectId of the poem to delete
     */
    async deleteFavoriteForAllUsers(poemId) {
        // Get all user ids
        let userIds = await userCollection.distinct('_id')

        // Get each user and remove the tagged poem from it
        for (let i = 0; i < userIds.length; i++) {
            await exportedMethods.deleteFavorite(userIds[i], poemId)
        }
    },

    /**
     *  Adds a follower to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} poemId - The ObjectId of the poem to add
     * @returns the updated user object
     */
    async addRecentlyViewedPoem(id, poemId) {
        return await addIdToUserField(id, poemId, "recentlyViewedPoemIds")
    },

    /**
     *  Deletes a recently viewed poem from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} poemId - The ObjectId of the poem to delete
     * @returns the updated user object
     */
    async deleteRecentlyViewedPoem(id, poemId) {
        return await deleteIdFromUserField(id, poemId, "recentlyViewedPoemIds")
    },

    /**
     * Delete a recently viewed poem from all users
     * 
     * @param {string|ObjectId} poemId - The ObjectId of the poem to delete
     */
    async deleteRecentlyViewedPoemForAllUsers(poemId) {
        // Get all user ids
        let userIds = await userCollection.distinct('_id')

        // Get each user and remove the tagged poem from it
        for (let i = 0; i < userIds.length; i++) {
            await exportedMethods.deleteRecentlyViewedPoem(userIds[i], poemId)
        }
    },

    /**
     * Adds a follower to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} followerId - The ObjectId of the follower to add
     * @returns the updated user object
     */
    async addFollower(id, followerId) {
        await addIdToUserField(followerId, id, "following")
        return await addIdToUserField(id, followerId, "followers")
    },

    /**
     *  Deletes a follower from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} followerId - The ObjectId of the follower to delete
     * @returns the updated user object
     */
    async deleteFollower(id, followerId) {
        await deleteIdFromUserField(followerId, id, "following")
        return await deleteIdFromUserField(id, followerId, "followers")
    },

    /**
     * Adds a following to the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} followingId - The ObjectId of the following to add
     * @returns the updated user object
     */
    async addFollowing(id, followingId) {
        addIdToUserField(followingId, id, "followers")
        return await addIdToUserField(id, followingId, "following")
    },

    /**
     * Deletes a following from the user with the given ObjectId
     * 
     * @param {string|ObjectId} id - The ObjectId of the user to update
     * @param {string|ObjectId} followingId - The ObjectId of the following to delete
     * @returns the updated user object
     */
    async deleteFollowing(id, followingId) {
        deleteIdFromUserField(followingId, id, "followers")
        return await deleteIdFromUserField(id, followingId, "following")
    },

    /**
     * Search for all users who's usernames match the given string
     * 
     * @param {string} str - Search string
     * @returns - All users who's usernames contain the given string
     */
    async searchByUsername(str){
        // Validate the search string
        str = validation.checkString(str)

        let retVal = []
        retVal.push(await userCollection.find({ username: { $regex: str, $options: 'i' } }).toArray())
        retVal = retVal.flat(Infinity)

        // Remove hashedPassword from each user object
        for (let i = 0; i < retVal.length; i++) {
            delete retVal[i].hashedPassword
        }
        
        return retVal
    },

    /**
     * Login a user
     * 
     * @param {string} username - The username of the user to get
     * @param {string} password - The password of the user to get
     */
    async login(username, password) {
        // Validate the username and password
        username = validation.checkUsername(username).toLowerCase()
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

    async calulcateAccountAge(id) {
        // Check the Id and convert it to a string
        id = checkId(id)

        // Get the user by id
        let user = await exportedMethods.getById(id)

        // Calculate the account age
        let accountAge = new Date() - new Date(user.timeAccountMade)
        
        let years = Math.floor(accountAge / (1000 * 60 * 60 * 24 * 365))
        let months = Math.floor((accountAge % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
        let days = Math.floor((accountAge % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))

        return { years, months, days }
    },

    async deletePoemFromAllUsers(poemId) {
        // Check the Id and convert it to a string
        poemId = checkId(poemId)

        await exportedMethods.deleteTaggedPoemForAllUsers(poemId);
        await exportedMethods.deleteFavoriteForAllUsers(poemId);
        await exportedMethods.deleteRecentlyViewedPoemForAllUsers(poemId);
    },

    /**
     * Add a tag to a poem
     * 
     * @param {string|ObjectId} userId 
     * @param {string} tagName 
     * @param {string|ObjectId} poemId 
     */
    async addTagToPoem(userId, tagName, poemId) {
        userId = checkId(userId)
        tagName = validation.checkTagString(tagName)
        poemId = checkId(poemId)

        // Make sure the global tags has the poemID
        let addedTag;
        try {
            addedTag = await tagsData.addTagToPoem(tagName, poemId.toString())
        } catch (e) {
            addedTag = await tagsData.getTagByName(tagName)
        }

        let taggedPoemObject = {}

        // See if the poem already had tags by the user
        let user = await exportedMethods.getById(userId)
        let alreadyExisted = false
        for(let i = 0; i < user.taggedPoems.length; i++) { 
            if(user.taggedPoems[i].poemId.toString() == poemId.toString()) {
                taggedPoemObject = user.taggedPoems[i]
                alreadyExisted = true
                break;
            }
        }

        if (Object.keys(taggedPoemObject).length == 0) {
            taggedPoemObject = {
                _id: new ObjectId(),
                poemId: new ObjectId(poemId),
                tagIds: [addedTag._id]
            }
        } else {
            if (idIsIn(addedTag._id, taggedPoemObject.tagIds)) {
                throw new Error("Poem already has that tag!")
            }

            taggedPoemObject.tagIds.push(addedTag._id)
        }
        if (taggedPoemObject.tagIds.length > 3) {
            throw new Error("You can only tag a poem 3 times!")
        }
        // Add the tagged poem to the user
        if (alreadyExisted) {
            // Delete the old tagged poem because of poor planning
            user = await exportedMethods.deleteTaggedPoem(userId, taggedPoemObject._id)
        }
        user = await exportedMethods.addTaggedPoem(userId, taggedPoemObject)


        // Make sure poems data is updated
        await poemsData.addTag(poemId.toString(), addedTag._id.toString())
        return user
    },

    /**
     *  Get a list of the favorite tags of a user
     * 
     * @param {string|ObjectId} userId 
     */
    async getFavoriteTags(userId) {
        userId = checkId(userId)

        let user = await exportedMethods.getById(userId)
        let tagIds = []

        for (let i = 0; i < user.taggedPoems.length; i++) {
            tagIds = tagIds.concat(user.taggedPoems[i].tagIds)
        }
        const frequencyMap = tagIds.reduce((map, item) => {
            const key = item.toString(); // Convert ObjectId to string for comparison
            map[key] = (map[key] || 0) + 1;
            return map;
        }, {});
        return Object.keys(frequencyMap).sort((a, b) => frequencyMap[b.toString()] - frequencyMap[a.toString()]).splice(0,3)
    }
}

export default exportedMethods