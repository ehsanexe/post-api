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

    type Mutation {
      setMessage(message: String): String,
      createUser(user: createUserInput): User,
    }
    type Query {
      posts: [Post],
      hello: String
    }
  `);

export default schema;
