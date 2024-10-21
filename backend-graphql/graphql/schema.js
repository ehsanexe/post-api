import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  buildSchema,
} from "graphql";

const schema = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }
    type Query {
      hello: TestData!
    }
  `);

export default schema;
