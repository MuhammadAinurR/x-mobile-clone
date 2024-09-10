const FollowModel = require("../models/Follow");

const resolvers = {
    Query: {
        follow: async (_, __) => {
            const followers = await FollowModel.getAll();
            return followers;
        },
    },
    Mutation: {
        hitFollow: async (_, args, contextValue) => {
            const { id: followerId } = contextValue.authentication();
            const { followingId } = args;
            const followLog = await FollowModel.hit({
                followingId,
                followerId,
            });
            return followLog;
        },
    },
};

module.exports = resolvers;
