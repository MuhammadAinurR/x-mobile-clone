const typeDefs = `#graphql
scalar DateTime
  type Follow {
    _id: ID!
    followingId: ID!
    followerId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  },

  type Query {
    follow: [Follow]
  },

  type Mutation {
    hitFollow(
        followingId: ID!
    ): Follow
  },
`;
module.exports = typeDefs;
