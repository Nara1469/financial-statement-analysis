const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    userPortfolio: [Portfolio]
  }

  input PortfolioInput {
    ticker: String!
  }

  type Portfolio {
    ticker: String
  }

  type Query {
    me: User
  }

  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String): Auth
    loginUser(email: String!, password: String): Auth
    saveTicker(portfolioData: PortfolioInput): User
    removeTicker(ticker: String): User
  }
`;

module.exports = typeDefs;
