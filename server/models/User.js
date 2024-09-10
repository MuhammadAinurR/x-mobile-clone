const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");
const { hashPassword } = require("../utils/bcrypt");

class UserModel {
    static async getAll() {
        const users = await database.collection("user").find().toArray();
        return users;
    }

    static async create(payload) {
        await database.collection("user").insertOne({
            ...payload,
            username: `@${payload.username}`,
            password: hashPassword(payload.password),
        });
    }

    static async getByUsername(username) {
        const user = await database.collection("user").findOne({
            username: username,
        });
        return user;
    }

    static async getByEmail(email) {
        const user = await database.collection("user").findOne({
            email: email,
        });
        return user;
    }

    static async getById(userId) {
        const agg = [
            {
                $match: {
                    _id: new ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followingId",
                    as: "follower",
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followerId",
                    as: "following",
                },
            },
            {
                $project: {
                    password: 0,
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "follower.followerId",
                    foreignField: "_id",
                    as: "followerData",
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "following.followingId",
                    foreignField: "_id",
                    as: "followingData",
                },
            },
            {
                $project: {
                    "followerData.password": 0,
                    "followingData.password": 0,
                },
            },
        ];
        const data = await database.collection("user").aggregate(agg).toArray();
        console.log(data);
        return data[0];
    }

    static async findUser(input) {
        const regex = new RegExp(input, "i");
        let users = await database
            .collection("user")
            .find({
                name: { $regex: regex },
            })
            .toArray();
        if (users.length === 0) {
            users = await database
                .collection("user")
                .find({
                    username: { $regex: regex },
                })
                .toArray();
        }

        return users;
    }

    static async getFollowers(userId) {
        const agg = [
            {
                $match: {
                    _id: new ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followingId",
                    as: "follower",
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followerId",
                    as: "following",
                },
            },
            {
                $project: {
                    password: 0,
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "follower.followerId",
                    foreignField: "_id",
                    as: "followerData",
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "following.followingId",
                    foreignField: "_id",
                    as: "followingData",
                },
            },
            {
                $project: {
                    "followerData.password": 0,
                    "followingData.password": 0,
                },
            },
        ];
        const data = await database.collection("user").aggregate(agg).toArray();
        console.log(data);
        return data[0];
    }
}

module.exports = UserModel;
