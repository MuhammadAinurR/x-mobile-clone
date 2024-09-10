const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class PostModel {
    static async getAll() {
        const agg = [
            {
                $lookup: {
                    from: "user",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: {
                    path: "$author",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unset: "author.password",
            },
        ];
        // const posts = await database.collection('posts').find().sort({ "createdAt": -1 }).toArray();
        const posts = await database
            .collection("posts")
            .aggregate(agg)
            .sort({ createdAt: -1 })
            .toArray();
        return posts;
    }

    static async create(payload) {
        const newPost = {
            ...payload,
            authorId: new ObjectId(payload.authorId),
            comments: [],
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await database.collection("posts").insertOne(newPost);
        return newPost;
    }

    static async like(postId, username) {
        const prevPost = await database.collection("posts").findOne({
            _id: new ObjectId(postId),
        });

        const newPost = {
            ...prevPost,
            likes: [
                ...prevPost.likes,
                {
                    username: username,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
        };

        await database
            .collection("posts")
            .replaceOne({ _id: new ObjectId(postId) }, newPost);
        return newPost;
    }
    static async comment(postId, username, content) {
        const prevPost = await database.collection("posts").findOne({
            _id: new ObjectId(postId),
        });

        const newPost = {
            ...prevPost,
            comments: [
                ...prevPost.comments,
                {
                    username: username,
                    content: content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
        };

        await database
            .collection("posts")
            .replaceOne({ _id: new ObjectId(postId) }, newPost);
        return newPost;
    }
}

module.exports = PostModel;
