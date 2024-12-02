import { buildSchema } from "graphql";

const schema = buildSchema(`
    input createUserInput {
      name: String!
      email: String!
      password: String!
    }
    type User {
      id: ID!
      name: String!
      email: String!
      posts: [Post]
    }
    type Post {
      id: ID!
      title: String!
      imageUrl: String!
      content: String!
      creator: User!
      createdAt: String!
    }
    type loginResponse {
      token: String!
      userId: String!
    }
    type postsResponse {
      posts: [Post]!
      totalItems: Int!
    }

    type Mutation {
      createUser(user: createUserInput): User,
    }
    type Query {
      login(email: String!, password: String!): loginResponse,
      posts(page: Int, pageSize: Int): postsResponse,
    }
  `);

export default schema;
