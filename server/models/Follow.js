const { ObjectId } = require("mongodb");
let { database } = require("../config/mongodb");
database = database.collection("follow");

class FollowModel {
    static async getAll() {
        const data = await database.find().toArray();
        return data;
    }

    static async hit({ followerId, followingId }) {
        const newFollowData = {
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(followingId),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await database.insertOne(newFollowData);
        return newFollowData;
    }
}

module.exports = FollowModel;
