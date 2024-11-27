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

    type Mutation {
      createUser(user: createUserInput): User,
      login(email: String!, password: String!): loginResponse,
    }
    type Query {
      posts: [Post],
    }
  `);

export default schema;
