import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
// import Auth from '../utils/auth';
import ImageIntro from "../images/intro-chart.jpg";

// import { removeBookId } from '../utils/localStorage';
// import { useQuery, useMutation } from '@apollo/client';
// import { GET_ME } from '../utils/queries';
// import { REMOVE_BOOK } from '../utils/mutations';

const HomePage = () => {
  // const { data } = useQuery(GET_ME);

  // const userData = data?.me || [];

  // const userDataLength = Object.keys(userData).length;

  // const [removeBook] = useMutation(REMOVE_BOOK);

  // // create function that accepts the book's mongo _id value as param and deletes the book from the database
  // const handleDeleteBook = async (bookId) => {
  //   const token = Auth.loggedIn() ? Auth.getToken() : null;

  //   if (!token) {
  //     return false;
  //   }

  //   try {
  //     await removeBook({
  //       variables: { bookId: bookId },
  //     });

  //     // upon success, remove book's id from localStorage
  //     removeBookId(bookId);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // if data isn't here yet, say so
  // if (!userDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

  return (
    <>
      <Jumbotron fluid className='text-light bg-blue'>
        <Container>
          <h1>Welcome!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <p className="intro-body-text">In this application you will be able to search and compare companies over the past 5 years using their financial ratios so that you may create accurate financial decisions. </p>

        <u><p className="body-text-steps"> Please follow these steps to get started: </p></u>

        <ol>
          <li>Sign-up or login by clicking on the Login button in the top right.</li>
          <li>Search for the company you want to research using the companies stock ticker.</li>
          <li>Choose the ratio you want to use by utilizing the dropdown menu.</li>
        </ol>
              <Card border='blue'>
              <p className="intro-body-text">In this application you will be able to search and compare companies over the past 5 years using their financial ratios so that you may create accurate financial decisions. </p>
                <Card.Body>
                  <Card.Title>Please follow these steps to get started: </Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text><p className="intro-body-text"> After completing the steps a chart similar to the one below will generate. </p></Card.Text>
                </Card.Body>
                <img className="example-chart" src={ImageIntro} alt="Introduction Chart" />
              </Card>
      </Container>
    </>
  );
};

export default HomePage;