import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      userPortfolio {
        ticker
      }
    }
  }
`;

export const CHECK_TICKER = gql`
  query checkticker($ticker: ID) {
    checkticker(ticker: $ticker) {
      _id
      username
      email
      userPortfolio {
        ticker
      }
    }
  }
`;
