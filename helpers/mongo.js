// Import from installs
import { Collection, ObjectId } from 'mongodb';

const exportedMethods = {
    /**
     *  Insert data into a collection
     * 
     * @param {Collection} collection - The collection to insert into
     * @param {Object} data - Data to insert into the collection
     * @returns the inserted data
     */
    async insertOne(collection, data) {
        // Attempt to insert into the collection
        const insertedData = await collection.insertOne(data);

        if (!insertedData.acknowledged || !insertedData.insertedId)
            throw new Error("Couldn't add data to collection")

        return insertedData;
    },
  
    /**
     *  Delete data from a collection
     * 
     * @param {Collection} collection - The collection to find data in
     * @param {*} data - The data to find and delete
     * @returns the deleted data
     */
    async findOneAndDelete(collection, data) {
        // Attempt to delete data from the collection
        const deletedData = await collection.findOneAndDelete(data)

        if (!deletedData) {
            throw `Could not delete data`
        }

        return deletedData
    },
  
    /**
     * Update data in a collection
     * 
     * @param {Collection} collection - The collection to find data in
     * @param {string|ObjectId} id - The id of the data to find
     * @param {Object} data - The data to update
     * @returns the updated data
     */
    async findOneAndUpdate(collection, id, data) {
        const updatedData = await collection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: data},
            {returnDocument: 'after'}
        )

        if (!updatedData) {
            throw new Error("Couldn't update collection with data")
        }

        return updatedData
    }
}
export default exportedMethods;