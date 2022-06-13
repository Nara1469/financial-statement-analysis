import React from 'react';
import { Jumbotron, Container, Card } from 'react-bootstrap';
import ImageIntro from "../images/intro-chart.jpg";

const HomePage = () => {

  return (
    <>
      <Jumbotron fluid className='bg-info'>
        <Container>
          <h1 className='text-center text-white'>Welcome!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <Card border='blue'>
          <Card.Text className='text-center'>In this application you will be able to search and compare companies over the past 5 years using their financial ratios so that you may create accurate financial decisions.</Card.Text>
          <Card.Body>
            <Card.Title>Please follow these steps to get started: </Card.Title>
            <ol>
              <li>Sign-up or login by clicking on the Login button in the top right.</li>
              <li>Search for the company you want to research using the companies stock ticker.</li>
              <li>Choose the ratio you want to use by utilizing the dropdown menu.</li>
            </ol>
            <Card.Text className='text-center'>After completing the steps a chart similar to the one below will generate.</Card.Text>
          </Card.Body>
          <Card.Img src={ImageIntro} alt="Introduction Chart" />
        </Card>
      </Container>
    </>
  );
};

export default HomePage;