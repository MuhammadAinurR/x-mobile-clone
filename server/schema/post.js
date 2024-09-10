const typeDefs = `#graphql
    scalar DateTime
    type Comment {
        content: String!
        username: String!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type CommentResult {
        message: String!
    }

    type Like {
        username: String!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type Author {
        _id: ID!
        name: String!
        username: String!
        email: String!
        imgUrl: String!
    },

    type Post {
        _id: ID!
        content: String!
        tags: [String]
        imgUrl: String!
        authorId: ID!
        author: Author!
        comments: [Comment]
        likes: [Like]
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type Query {
        posts: [Post]
    }

    type Mutation {
        addPost(
            content: String!
            tags: [String]
            imgUrl: String!
        ): Post

        like(
            postId: ID!
        ): Post

        comment(
            postId: ID!
            content: String!
        ): CommentResult
    }
`;
module.exports = typeDefs;
