import React, { useState, useEffect } from 'react';
import { Container, Form, Col, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveTickerIds, getSavedTickerIds, removeTickerId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { SAVE_TICKER, REMOVE_TICKER } from '../utils/mutations';


const calculateRatio = (symbol) => {
  const ticker = symbol;
  // const keyAPI = `17460026230d940ebe74cf92231eb36e`; // nara1
  // const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2
  // const keyAPI = `0e0111a172272a2fcfd42016bb1d29cf`; // ethan
  // const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon
  const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2

  let balanceSheetURL = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${keyAPI}&limit=120`;

  return fetch(balanceSheetURL);
};

const RatioPage = () => {
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

  // set up useEffect hook to save `savedTickerIds` list to localStorage on component unmount
  useEffect(() => {
    return () => userDataLength;
  });

  // create method to search for tickers and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await calculateRatio(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();
      // Getting Balance Sheet API returns 
      const companyData = items.map((company) => ({
        ticker: company.symbol,
        calendarYear: company.calendarYear,
        currentRatio: company.totalCurrentAssets / company.totalCurrentLiabilities,
        quickRatio: (company.cashAndCashEquivalents + company.netReceivables) / company.totalCurrentLiabilities,
        workingCapital: company.totalCurrentAssets - company.totalCurrentLiabilities,
      }));

      console.log(companyData);

      setSearchedCompany(companyData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a ticker to our database
  const handleSaveTicker = async (ticker) => {
    // find the ticker in `userPortfolio` state by the matching name
    const tickerToSave = ticker;

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
      setSavedTickerIds([...savedTickerIds, tickerToSave]);
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
      <Container fluid className='text-light bg-dark'>
        <h1>Welcome, {userData.username}!</h1>
        <Form onSubmit={handleFormSubmit}>
          <Form.Row>
            <Col xs={12} md={8}>
              <Form.Label>Portfolio: </Form.Label>
              <Form.Control
                name='searchInput'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                type='text'
                size='lg'
                placeholder='Search for a ticker'
              />
            </Col>
            <Col xs={12} md={4}>
              <Button type='submit' variant='success' size='lg'>
                Submit Search
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <Button
          disabled={savedTickerIds?.some((savedTickerId) => savedTickerId === searchedCompany.symbol)}
          className='btn-block btn-info'
          onClick={() => handleSaveTicker(searchedCompany.symbol)}>
          {savedTickerIds?.some((savedTickerId) => savedTickerId === searchedCompany.symbol)
            ? 'This ticker has already been saved!'
            : 'Save this Ticker!'}
        </Button>
        <Form>
          {userData.userPortfolio.map((company) => (
            <div key={`inline-${company.ticker}`} className="mb-3">
              <Form.Check
                inline
                label={company.ticker}
                name="group1"
                type="radio"
                id={company.ticker}
              />
              <div className="icons">
                <p onClick={() => handleDeleteTicker(company.ticker)}> 🗑️</p>
              </div>
            </div>
          ))}
        </Form>
      </Container>
    </>
  );
};

export default RatioPage;
