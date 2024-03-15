import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  input EditUserInput {
    firstName: String
  }

  type Query {
    user(ID: ID!): User!
    getUsers(amount: Float): [User]
  }

  type Mutation {
    createUser(UserInput: UserInput): User!
    deleteUser(ID: ID!): Boolean
    editUser(ID: ID!, userInput: UserInput): Boolean
  }
`;

export default typeDefs;
