const redis = require("../config/redis");
const PostModel = require("../models/Post");

const resolvers = {
    Query: {
        posts: async (_, __, contextValue) => {
            contextValue.authentication();
            const postsCache = await redis.get("posts:all");
            if (postsCache) {
                console.log("masuk chache");
                console.log(postsCache);
                return JSON.parse(postsCache);
            }
            console.log("masuk mongo");
            const posts = await PostModel.getAll();
            await redis.set("posts:all", JSON.stringify(posts));
            return posts;
        },
    },
    Mutation: {
        addPost: async (_, { content, tags, imgUrl }, contextValue) => {
            const { id: authorId } = contextValue.authentication();
            const post = await PostModel.create({
                content,
                tags,
                imgUrl,
                authorId,
            });
            await redis.del("posts:all");
            return post;
        },
        like: async (_, { postId }, contextValue) => {
            const { username } = contextValue.authentication();
            const post = await PostModel.like(postId, username);
            await redis.del("posts:all");
            return post;
        },
        comment: async (_, { postId, content }, contextValue) => {
            const { username } = contextValue.authentication();
            await PostModel.comment(postId, username, content);
            await redis.del("posts:all");
            return { message: "comment success" };
        },
    },
};

module.exports = resolvers;
