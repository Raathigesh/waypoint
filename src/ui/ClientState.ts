import gql from "graphql-tag";

export const typeDefs = gql`
  extend type Rule {
    name: String!
    pathPattern: String!
  }

  extend type WorkspaceState {
    rules: [Rule!]!
  }
`;

export const resolvers = {};
