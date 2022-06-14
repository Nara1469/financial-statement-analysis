import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const ProfileTab = ({ ticker }) => {
  // console.log(ticker);

  const [company, setCompany] = useState([]);

  useEffect(() => {

    const getProfileInfo = async () => {

      const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon

      const companyURL = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${keyAPI}`;

      const response = await fetch(companyURL);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const data = await response.json();

      // console.log(data);
      setCompany(data);

    }
    getProfileInfo();

  }, [ticker]);

  return (
    <>
      <Container fluid className='bg-info add-space'>
        <h5 className='text-center text-white'>Company Profile</h5>
        {(company.length > 0) && (
          <Card key={`profile-${company[0].symbol}`} border='blue'>         
            <Card.Header>{`${company[0].companyName} [${company[0].symbol}]`}</Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={8}>
                  <Card.Text>Website: <a target='_blank' rel='noreferrer' href={company[0].website}>{company[0].website}</a></Card.Text>
                  <Card.Text>{`Exchange: ${company[0].exchangeShortName}`}</Card.Text>
                  <Card.Text>{`Industry: ${company[0].industry}`}</Card.Text>
                  <Card.Text>{`Sector: ${company[0].sector}`}</Card.Text>
                </Col>
                <Col xs={12} md={4}>
                  <Card.Img className='company-logo' src={company[0].image} alt='Company Icon' variant='top' />
                  <Card.Text>{`IPO Date: ${company[0].ipoDate}`}</Card.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Text>{company[0].description}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default ProfileTab;
