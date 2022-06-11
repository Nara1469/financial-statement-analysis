import React, { useState, useEffect } from "react";
import { PortfolioTable } from '../components/PortfolioTable';
import {
  Container,
  Form,
  Card,
  Row,
  Col,
  Button,
  ListGroup,
  Tab,
  Tabs,
} from "react-bootstrap";
import Auth from "../utils/auth";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { SAVE_TICKER, REMOVE_TICKER } from "../utils/mutations";

// const KEY = process.env.REACT_APP_API_KEY;
// console.log(KEY);

// let userPortfolioArray = [];

let portfolioTableData = [];

const ShowPortfolioData = () => {

let profile = [];
let ratio =  []

const getPortfolioTableData = async (symbol) => {
  const ticker = symbol;
  const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // Brandon
  // const keyAPI = `17460026230d940ebe74cf92231eb36e`; // nara1
  // const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2

  let companyProfileURL = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${keyAPI}`;
  const profileResponse =  await fetch(companyProfileURL);

  // let companyKeyMetricsURL = `https://financialmodelingprep.com/api/v3/key-metrics/${ticker}?apikey=${keyAPI}`;
  // const keyMetricsResponse =  await fetch(companyKeyMetricsURL);

  let companyTTMRatiosURL = `https://financialmodelingprep.com/api/v3/ratios-ttm/${ticker}?apikey=${keyAPI}`;
  const ttmRatioResponse =  await fetch(companyTTMRatiosURL);

  portfolioTableData.push({
        ticker: profileResponse.symbol,
        price: profileResponse.price,
        beta:  profileResponse.beta,
        mktCap: profileResponse.mktCap,
        change: profileResponse.changes,
        range: profileResponse.range,
        returnOnEquityTTM: ttmRatioResponse.returnOnEquityTTM,
        returnOnAssetsTTM: ttmRatioResponse.returnOnAssetsTTM,
        operatingProfitMarginTTM: ttmRatioResponse.operatingProfitMarginTTM,
        debtEquityRatioTTM: ttmRatioResponse.debtEquityRatioTTM,
        peRatioTTM: ttmRatioResponse.peRatioTTM,
        pbRationTTM: ttmRatioResponse.priceBookValueRatioTTM
      })
      console.log("Portfolio Data", portfolioTableData)
    }
}

ShowPortfolioData();

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
  // Existing User Portfolio Tickers
  const { data } = useQuery(GET_ME);
  let userData = data?.me || [];
  const userDataLength = Object.keys(userData).length;

  // create state for holding returned API data for a company
  const [searchedCompany, setSearchedCompany] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");
  // create state to hold saved userPortfolio tickers. This state variable is used for localStorage
  const [userPortfolioArray, setUserPortfolioArray] = useState([]);

  const [saveTicker] = useMutation(SAVE_TICKER);
  const [removeTicker] = useMutation(REMOVE_TICKER);

  // set up useEffect hook to save `savedTickerIds` list to localStorage on component unmount
  useEffect(() => {
    // return () => handleSaveTicker();
  }, [userPortfolioArray]);

  // create method to search for tickers and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    if (userPortfolioArray.length === 0) {
      const currentPortfolio = (await userData?.userPortfolio) || [];
      if (currentPortfolio.length > 0) {
        const userPortfolioData = currentPortfolio.map((company) => company.ticker);
        setUserPortfolioArray(userPortfolioData);
        console.log(userPortfolioArray);
      }
    }
    try {
      const response = await getCompanyInfo(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const data = await response.json();

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
      console.log(userPortfolioArray);
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
      const currentPortfolio = userPortfolioArray.filter(
        (company) => company !== ticker
      );
      setUserPortfolioArray(currentPortfolio);
      console.log(userPortfolioArray);
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
      <Container fluid className="text-dark bg-blue">
        <h2 className="text-center">Welcome, {userData.username}!</h2>
        <Row>
          <Col xs={12} md={6}>
            <Form onSubmit={handleFormSubmit}>
              <Form.Label>Search for Companies: </Form.Label>
              <Form.Control
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                type="text"
                size="lg"
                placeholder="Enter a ticker"
              />
              <Button type="submit" variant="primary">
                Submit Search
              </Button>
            </Form>
          </Col>
          <Col xs={12} md={6}>
            <h6>
              {userData.userPortfolio.length
                ? `${userData.username}'s Portfolio: (${
                    userData.userPortfolio.length
                  } ${
                    userData.userPortfolio.length === 1
                      ? "company"
                      : "companies"
                  } saved)`
                : "You have not add any company in your portfolio!"}
            </h6>
            <ListGroup variant="flush">
              {userData.userPortfolio.length > 0 &&
                userData.userPortfolio.map((company) => (
                  <ListGroup.Item key={`list-${company.ticker}`}>
                    {company.ticker}
                    <Button
                      variant="light"
                      onClick={() => handleDeleteTicker(company.ticker)}
                    >
                      {" "}
                      🗑️{" "}
                    </Button>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Col>
        </Row>
        {searchedCompany.length > 0 && (
          <Card key={`info-${searchedCompany[0].symbol}`} border="blue">
            <Card.Header>{`${searchedCompany[0].companyName}`}</Card.Header>
            <Tabs defaultActiveKey="first">
              <Tab eventKey="first" title="Profile">
                <Card key={`info-${searchedCompany[0].symbol}`} border="blue">
                  <Card.Body>
                    <Row>
                      <Col xs={12} md={8}>
                        <Card.Text>{`Website: ${searchedCompany[0].website}`}</Card.Text>
                        <Card.Text>{`Exchange: ${searchedCompany[0].exchangeShortName}`}</Card.Text>
                        <Card.Text>{`Industry: ${searchedCompany[0].industry}`}</Card.Text>
                        <Card.Text>{`Sector: ${searchedCompany[0].sector}`}</Card.Text>
                      </Col>
                      <Col xs={12} md={4}>
                        <Card.Img
                          className="company-logo"
                          src={searchedCompany[0].image}
                          alt="Company Icon"
                          variant="top"
                        />
                        <Card.Text>{`Ticker: ${searchedCompany[0].symbol}`}</Card.Text>
                        <Card.Text>{`IPO Date: ${searchedCompany[0].ipoDate}`}</Card.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Card.Text>{searchedCompany[0].description}</Card.Text>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>

              {/* SECOND TAB */}
              <Tab eventKey="second" title="Financial Summary">
                <Card key={`info-${searchedCompany[0].symbol}`} border="blue">
                  <Card.Body>
                    <Row>
                    {(<PortfolioTable tableData={portfolioTableData} />)}
                    </Row>
                    <Row>
                      {<Button className="btn-block btn-info">
                    {/* <a href = "/api/v3/income-statement/AAPL?datatype=csv"></a> */}
                    </Button>}
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>

            {/* SAVE TICKER TO PORTFOLIO */}
            <Button
              disabled={userPortfolioArray?.some(
                (company) => company === searchedCompany[0].symbol
              )}
              className="btn-block btn-info"
              variant="info"
              onClick={() => handleSaveTicker(searchedCompany[0].symbol)}
            >
              {userPortfolioArray?.some(
                (company) => company === searchedCompany[0].symbol
              )
                ? "This company ticker has already been saved!"
                : "Save this Company!"}
            </Button>
          </Card>
        )}
      </Container>
    </>
  );
};

export default PortfolioPage;