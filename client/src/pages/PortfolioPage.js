import React, { useState, useEffect } from 'react';
import { Container, Form, Card, Row, Col, Button, ListGroup } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveTickerIds, getSavedTickerIds, removeTickerId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { SAVE_TICKER, REMOVE_TICKER } from '../utils/mutations';

// const KEY = process.env.REACT_APP_API_KEY;
// console.log(KEY);

const getCompanyInfo = (symbol) => {
  const ticker = symbol;
  // const keyAPI = `17460026230d940ebe74cf92231eb36e`; // nara1
  // const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2
  // const keyAPI = `0e0111a172272a2fcfd42016bb1d29cf`; // ethan
  // const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon

  const keyAPI = `d819321c933c451db684ef4a2b41d62d`;

  let companyURL = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${keyAPI}`;

  return fetch(companyURL)
};

const PortfolioPage = () => {

  const { data } = useQuery(GET_ME);

  const userData = data?.me || [];

  const userDataLength = Object.keys(userData).length;

  // create state for holding returned financialmodelingprep api data for a company
  const [searchedCompany, setSearchedCompany] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  // create state to hold saved userPortfolio tickers
  const [savedTickerIds, setSavedTickerIds] = useState(getSavedTickerIds());

  const [saveTicker] = useMutation(SAVE_TICKER);
  const [removeTicker] = useMutation(REMOVE_TICKER);

  // const savePortfolio = async (userData) => {

  //   const currentPortfolio = userData.userPortfolio.map((company) => {company.ticker});

  //   if (tempArray.length > 0) {
  //     for (let i = 0; i < tempArray.length; i++) {
  //       let element = tempArray[i].ticker;
  //       currentPortfolio.push(element);
  //     }
  //     saveTickerIds(currentPortfolio);
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // set up useEffect hook to save `savedTickerIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveTickerIds(savedTickerIds);
  });

  // create method to search for tickers and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await getCompanyInfo(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const data = await response.json();

      console.log(data);

      setSearchedCompany(data);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a ticker to our database
  const handleSaveTicker = async (ticker) => {
    // find the ticker in `userPortfolio` state by the matching name
    const tickerToSave = { ticker };

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveTicker({
        variables: { portfolioData: tickerToSave },
      });

      // if ticker successfully saves to user's portfolio, save the ticker to state
      setSavedTickerIds([...savedTickerIds, ticker]);
      saveTickerIds(savedTickerIds);
    } catch (err) {
      console.error(err);
    }
  };

  // create function that accepts the userPortfolio's ticker value as param and deletes the ticker from the database
  const handleDeleteTicker = async (tickerId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeTicker({
        variables: { ticker: tickerId },
      });

      // upon success, remove a ticker from localStorage
      removeTickerId(tickerId);

    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }
  return (
    <>
      <Container fluid className='text-dark bg-blue'>
        <h2 className='text-center'>Welcome, {userData.username}!</h2>

        <Form onSubmit={handleFormSubmit}>
          <Form.Row>
            <Col xs={12} md={6}>
              <Form.Label>Portfolio: </Form.Label>
              <Form.Control
                name='searchInput'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                type='text'
                size='lg'
                placeholder='Search for a ticker'
              />
              <Button type='submit' variant='primary'>
                Submit Search
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <h6>
                {userData.userPortfolio.length
                  ? `Viewing ${userData.userPortfolio.length} saved ${userData.userPortfolio.length === 1 ? 'company' : 'companies'}:`
                  : 'You have not add any company in your portfolio!'}
              </h6>
              <ListGroup variant="flush">
                {(userData.userPortfolio.length > 0) && (userData.userPortfolio.map((company) => (
                  <ListGroup.Item key={`list-${company.ticker}`}>
                    {company.ticker}
                    <p className='text-right'><Button variant='light' onClick={() => handleDeleteTicker(company.ticker)}> 🗑️</Button></p>
                  </ListGroup.Item>
                )))}
              </ListGroup>
            </Col>
          </Form.Row>
        </Form>
        {(searchedCompany.length > 0) && (
          <Card key={`info-${searchedCompany[0].symbol}`} border='blue'>
            <Card.Header>{`${searchedCompany[0].companyName}`}</Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={8}>
                  <Card.Text>{`Website: ${searchedCompany[0].website}`}</Card.Text>
                  <Card.Text>{`Exchange: ${searchedCompany[0].exchangeShortName}`}</Card.Text>
                  <Card.Text>{`Industry: ${searchedCompany[0].industry}`}</Card.Text>
                  <Card.Text>{`Sector: ${searchedCompany[0].sector}`}</Card.Text>
                </Col>
                <Col xs={12} md={4}>
                  <Card.Img className='company-logo' src={searchedCompany[0].image} alt='Company Icon' variant='top' />
                  <Card.Text>{`Ticker: ${searchedCompany[0].symbol}`}</Card.Text>
                  <Card.Text>{`IPO Date: ${searchedCompany[0].ipoDate}`}</Card.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Text>{`Description: ${searchedCompany[0].description}`}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
            <Button
              disabled={savedTickerIds?.some((savedTickerId) => savedTickerId === searchedCompany[0].symbol)}
              className='btn-block btn-info' type='primary'
              onClick={() => handleSaveTicker(searchedCompany[0].symbol)}>
              {savedTickerIds?.some((savedTickerId) => savedTickerId === searchedCompany[0].symbol)
                ? 'This company ticker has already been saved!'
                : 'Save this Company!'}
            </Button>
          </Card>
        )}
      </Container>
    </>
  );
};

export default PortfolioPage;
