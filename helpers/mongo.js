// Import from installs
import { ObjectId } from 'mongodb';

const exportedMethods = {
    async insertOne(collection, data) {
        // Attempt to insert into the collection
        const insertedData = await collection.insertOne(data);

        if (!insertedData.acknowledged || !insertedData.insertedId)
            throw new Error("Couldn't add data to collection")

        return insertedData;
    },
    async findOneAndDelete(collection, data) {
        // Attempt to delete data from the collection
        const deletedData = await collection.findOneAndDelete(data)

        if (!deletedData) {
            throw `Could not delete data`
        }

        return deletedData
    },
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