import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_TICKER = gql`
  mutation saveTicker($portfolioData: PortfolioInput) {
    saveTicker(portfolioData: $portfolioData) {
      _id
      username
      email
      userPortfolios {
        ticker
      }
    }
  }
`;

export const REMOVE_TICKER = gql`
  mutation removeTicker($ticker: String) {
    removeTicker(ticker: $ticker) {
      _id
      username
      email
      userPortfolios {
        ticker
      }
    }
  }
`;