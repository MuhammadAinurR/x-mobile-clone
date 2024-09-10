const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
    access_token: String!
    followerData: [User]
    followingData: [User]
  },

  type SimpleUserData {
    _id: ID!
    name: String!
    username: String!
  }
    type GetUserById {
    _id: ID!
    name: String!
    username: String!
    email: String!
    imgUrl: String!
    followerData: [SimpleUserData]
    followingData: [SimpleUserData]
  }

  type Login {
    access_token: String!
    _id: ID!
  }

  type FindUserOutput {
    _id: ID!
    username: String!
    name: String!
    imgUrl: String!
  }

  type Query {
    users: [User],

    getUserById(
        userId: String
    ): GetUserById,

    getUserByNameOrUsername(
        nameOrUsername: String
    ): [FindUserOutput]
  },

  type Mutation {
    addUser(
        name: String,
        username: String,
        email: String,
        password: String,
        imgUrl: String
    ): User

    login(
        email: String,
        password: String
    ): Login

    followers(
        userId: String
    ): User


  },
`;
module.exports = typeDefs;
