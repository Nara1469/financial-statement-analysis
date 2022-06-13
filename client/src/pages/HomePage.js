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
          <Card.Text className='text-center'>In this application you will be able to search and compare companies over the past 5 years using their financial ratios and other key metrics. With all this this you may do your own reaseach in other to make accurate financial decisions.</Card.Text>
          <Card.Body>
            <Card.Title className='text-center font-weight-bold'>Please follow these steps to get started: </Card.Title>
            <ol className='text-monospace'>
              <li>Sign-up or login by clicking on the "Login/Sign Up" button in the top right.</li>
              <li>Once signed in you'll see that the "Portfolio" and "Ratio" pages have been made available</li>
              <li>In your portfolio page search and save companies to your Portfolio and review the profile, financial summary, and financial statment of those companies.</li>
              <li>In the ratio page search for the companies and metrics of your and use the vizualization tools to draw comparisions.</li>
              <li>Lastly leave this site better informed to make great financial decisions!</li>
            </ol>
            <Card.Text className='text-center text-muted'>Vizualization tools similar to the one below can be generated.</Card.Text>
          </Card.Body>
          <Card.Img src={ImageIntro} alt="Introduction Chart" />
        </Card>
      </Container>
    </>
  );
};

export default HomePage;