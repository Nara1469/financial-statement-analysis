import React, { useState, useEffect } from 'react';
import { Container, Form, InputGroup, Card, Row, Col, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { SAVE_TICKER, REMOVE_TICKER } from '../utils/mutations';
import NavTabs from '../components/Navigation';
import ProfileTab from '../components/Profile';
import SummaryTab from '../components/Summary';
import StatementTab from '../components/Statement';


const getCompanyInfo = (ticker) => {


  // const keyAPI = `17460026230d940ebe74cf92231eb36e`; // nara1
  // const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2
  // const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon

  const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon

  // const keyAPI = `${process.env.REACT_APP_API_KEY}`;

  let companyURL = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${keyAPI}`;


  return fetch(companyURL)
};

const PortfolioPage = () => {

  const { data } = useQuery(GET_ME);

  let userData = data?.me || [];

  let userDataLength = Object.keys(userData).length;

  // create state for holding returned financialmodelingprep api data for a company
  const [searchedCompany, setSearchedCompany] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  // create state to hold saved userPortfolio tickers. This state variable is used for localStorage 
  const [userPortfolioArray, setUserPortfolioArray] = useState([]);

  const [currentPage, setCurrentPage] = useState('Profile');
  const [currentCompany, setCurrentCompany] = useState('');

  const [saveTicker] = useMutation(SAVE_TICKER);
  const [removeTicker] = useMutation(REMOVE_TICKER);

  useEffect(() => {
    // return () => handleSaveTicker();
  }, [currentCompany, userPortfolioArray]);

  const renderPage = () => {
    switch (currentPage) {
      case 'Profile':
        return <ProfileTab ticker={currentCompany} />;
      case 'Financial Summary':
        return <SummaryTab ticker={currentCompany} />;
      case 'Financial Statement':
        return <StatementTab ticker={currentCompany} />;
      default:
        return <ProfileTab ticker={currentCompany} />;
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // create method to search for tickers and set state on form submit
  const handleFormSubmit = async () => {
    if (!searchInput) {
      return false;
    }

    if (userPortfolioArray.length === 0) {
      const currentPortfolio = await userData?.userPortfolio || [];
      if (currentPortfolio.length > 0) {
        const userPortfolioData = currentPortfolio.map((company) => (company.ticker));
        setUserPortfolioArray(userPortfolioData);
        // console.log(userPortfolioArray);
      }
    }

    try {
      const response = await getCompanyInfo(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const data = await response.json();
      console.log(data);

      setSearchedCompany(data);
      setCurrentCompany('');
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a ticker to our database
  const handleSaveTicker = async (ticker) => {

    // find the ticker in `userPortfolio` state by the matching name
    const tickerToSave = { ticker };

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveTicker({
        variables: { portfolioData: tickerToSave },
      });

      // if ticker successfully saves to user's portfolio, save the ticker to state
      setUserPortfolioArray([...userPortfolioArray, ticker]);
      // console.log(userPortfolioArray);

    } catch (err) {
      console.error(err);
    }
  };

  // create function that accepts the userPortfolio's ticker value as param and deletes the ticker from the database
  const handleDeleteTicker = async (ticker) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeTicker({
        variables: { ticker: ticker },
      });

      // upon success, remove a ticker from userPortfolioArray
      const currentPortfolio = userPortfolioArray.filter((company) => (company !== ticker));
      setUserPortfolioArray(currentPortfolio);
      // console.log(userPortfolioArray);
      setCurrentCompany('');

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
      <Container fluid>
        <h2 className='text-center text-info'>Welcome, {userData.username}!</h2>
        <Row>
          <Col xs={12} md={6}>
            <InputGroup className="mb-3 add-space">
              <Form.Control
                key={'portfolio-search-input'}
                name='searchInput'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                type='text'
                size='lg'
                placeholder='Search for companies'
              />
              <Button variant="info" id="button-addon2" onClick={() => handleFormSubmit()}>
                Search
              </Button>
            </InputGroup>
          </Col>
          <Col xs={12} md={6}>
            <Card key={`info-portfolio`} border='blue' className='add-space'>
              <Card.Header>
                {(userData.userPortfolio.length > 0)
                  ? `${userData.username}'s Portfolio: (${userData.userPortfolio.length} ${userData.userPortfolio.length === 1 ? 'company' : 'companies'} saved)`
                  : 'You have not add any company in your portfolio!'}
              </Card.Header>
              <Card.Body>
                {(userData.userPortfolio.length > 0) && (userData.userPortfolio.map((company) => (
                  <Row key={`info-portfolio-${company.ticker}`}>
                    <Col xs={8} className='single-ticker'>
                      <Button variant='light' onClick={() => setCurrentCompany(company.ticker)}>{company.ticker}</Button>
                    </Col>
                    <Col xs={4} className='text-right'>
                      <Button variant='light' onClick={() => handleDeleteTicker(company.ticker)}> 🗑️ </Button>
                    </Col>
                  </Row>
                )))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {((searchedCompany.length > 0) && (!currentCompany)) &&
          (<Card key={`info-${searchedCompany[0].symbol}`} border='blue' className='add-space'>
            <Card.Header style={{fontWeight: 'bold'}}>{`${searchedCompany[0].companyName} [${searchedCompany[0].symbol}]`}</Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={8}>
                  <Card.Text>Website: <a target='_blank' rel='noreferrer' href={searchedCompany[0].website}>{searchedCompany[0].website}</a></Card.Text>
                  <Card.Text>{`Exchange: ${searchedCompany[0].exchangeShortName}`}</Card.Text>
                  <Card.Text>{`Industry: ${searchedCompany[0].industry}`}</Card.Text>
                  <Card.Text>{`Sector: ${searchedCompany[0].sector}`}</Card.Text>
                </Col>
                <Col xs={12} md={4}>
                  <Card.Img className='company-logo' src={searchedCompany[0].image} alt='Company Icon' variant='top' />
                  <Card.Text>{`IPO Date: ${searchedCompany[0].ipoDate}`}</Card.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Text>{searchedCompany[0].description}</Card.Text>
                </Col>
              </Row>
            </Card.Body>
            <Button
              disabled={userPortfolioArray?.some((company) => company === searchedCompany[0].symbol)}
              className='btn-block btn-info' type='primary'
              onClick={() => handleSaveTicker(searchedCompany[0].symbol)}>
              {userPortfolioArray?.some((company) => company === searchedCompany[0].symbol)
                ? 'This company ticker has already been saved!'
                : 'Save this Company!'}
            </Button>
          </Card>
          )}
        {(currentCompany) && (
          <div className='add-space'>
            <NavTabs currentPage={currentPage} handlePageChange={handlePageChange} />
            {renderPage()}
          </div>
        )}
      </Container>
    </>
  );
};

export default PortfolioPage;
