const UserModel = require("../models/User");
const { comparePassword } = require("../utils/bcrypt");
const { signToken } = require("../utils/jwt");

const resolvers = {
    Query: {
        users: async (_, __) => {
            const users = await UserModel.getAll();
            return users;
        },

        getUserById: async (_, { userId }) => {
            const user = await UserModel.getById(userId);
            return user;
        },

        getUserByNameOrUsername: async (_, { nameOrUsername }) => {
            if (!nameOrUsername) throw new Error("search must not empty");

            const user = await UserModel.findUser(nameOrUsername);
            if (!user) throw new Error("username is not found");
            return user;
        },
    },
    Mutation: {
        addUser: async (_, { name, username, email, password, imgUrl }) => {
            const newUser = { name, username, email, password, imgUrl };
            await UserModel.create(newUser);
            return newUser;
        },
        login: async (_, { email, password }) => {
            if (!email) throw new Error("username is required");
            if (!password) throw new Error("password is required");

            const user = await UserModel.getByEmail(email);
            if (!user) throw new Error("username or password is not valid");

            const isPasswordValid = comparePassword(password, user.password);
            if (!isPasswordValid)
                throw new Error("username or password is not valid");

            const access_token = signToken({
                id: user._id,
                mame: user.name,
                username: user.username,
                email: user.email,
                imgUrl: user.imgUrl,
            });
            return { access_token, _id: user._id };
        },
        followers: async (_, { userId }) => {
            const followers = await UserModel.getFollowers(userId);
            return followers;
        },
    },
};
module.exports = resolvers;
