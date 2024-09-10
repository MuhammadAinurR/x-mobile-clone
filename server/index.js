require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const typeDefsUser = require("./schema/user");
const typeDefsPost = require("./schema/post");
const typeDefsFollow = require("./schema/follow");

const resolversUser = require("./resolvers/user");
const resolversPost = require("./resolvers/post");
const resolversFollow = require("./resolvers/follow");
const { verifyToken } = require("./utils/jwt");
const server = new ApolloServer({
    typeDefs: [typeDefsUser, typeDefsPost, typeDefsFollow],
    resolvers: [resolversUser, resolversPost, resolversFollow],
    introspection: true,
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: async ({ req, res }) => {
            return {
                authentication: () => {
                    const token = req.headers.authorization;

                    if (!token) throw new Error("Unauthorized");

                    const [type, tokenValue] = token.split(" ");

                    if (type !== "Bearer") throw new Error("Unauthorized");

                    const decoded = verifyToken(tokenValue);

                    return decoded;
                },
                authorization: () => {},
            };
        },
    });

    console.log(`🚀  Server ready at: ${url}`);
}

startServer();
