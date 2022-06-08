import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button, ListGroup, Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// import { saveTickerIds, getSavedTickerIds, removeTickerId } from '../utils/localStorage';
// import { useQuery, useMutation } from '@apollo/client';
// import { GET_ME } from '../utils/queries';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ------------ Variables ----------- 
let options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

let companyDataCollection = [];
let datasetArray = [];
let labels = [];
const colorArray = ['red', 'blue', 'green', 'purple', 'orange', 'black', 'grey', 'yellow', 'pink', 'navy'];
const ratioArray = ['Current Ratio', 'Quick Ratio', 'Working Capital'];

let chartData = {
  labels,
  datasets: datasetArray,
};

// ------------ Functions ----------- 
const calculateRatio = async (symbol) => {
  const ticker = symbol;
  // const keyAPI = `17460026230d940ebe74cf92231eb36e`; // nara1
  // const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2
  // const keyAPI = `0e0111a172272a2fcfd42016bb1d29cf`; // ethan
  // const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon
  const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2

  let balanceSheetURL = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${keyAPI}&limit=120`;

  const response = await fetch(balanceSheetURL);

  if (!response.ok) {
    throw new Error('something went wrong!');
  }

  const items = await response.json();

  const companyData = items.map((company) => ({
    ticker: company.symbol,
    calendarYear: company.calendarYear,
    currentRatio: company.totalCurrentAssets / company.totalCurrentLiabilities,
    quickRatio: (company.cashAndCashEquivalents + company.netReceivables) / company.totalCurrentLiabilities,
    workingCapital: company.totalCurrentAssets - company.totalCurrentLiabilities,
  }));

  console.log(companyData);
  return companyData;
};

const RatioPage = () => {
  // const { data } = useQuery(GET_ME);

  // const userData = data?.me || [];

  // const userDataLength = Object.keys(userData).length;

  // create state for holding returned financialmodelingprep api data for a company
  const [searchedCompany, setSearchedCompany] = useState('');
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  // create state to hold saved userPortfolio tickers
  // const [savedTickerIds, setSavedTickerIds] = useState(getSavedTickerIds());
  const [portfolioChoice, setPortfolioChoice] = useState([]);
  const [ratioChoice, setRatioChoice] = useState('Current Ratio');

  // const [companyDataCollection, SetCompanyDataCollection] = useState([]);

  useEffect(() => {
      setRatioChoice('Current Ratio');
    },
    [chartData],
  );

  // method to search for tickers and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    setSearchedCompany(searchInput);
    setSearchInput('');
  };

  // collects company data from financialmodelingprep API
  const collectCompanyData = async (ticker) => {

    if (!portfolioChoice) {
      companyDataCollection = [];
      return false;
    }

    try {
      const companyData = await calculateRatio(ticker);
      console.log(companyData);

      for (let i = 4; i >= 0; i--) {
        const element = companyData[i];
        companyDataCollection.push(element);
      }

      console.log(companyDataCollection);
    } catch (err) {
      console.error(err);
    }

    return true;
  };

  const showChart = () => {
    if (!portfolioChoice) {
      return false;
    }
    
    const choice = ''
    setRatioChoice(choice);

    datasetArray = [];
    console.log(companyDataCollection);
    for (let i = 0; i < portfolioChoice.length; i++) {
      const ticker = portfolioChoice[i];
      const businessData = [];
      const companyData = companyDataCollection.filter((company) => (company.ticker === ticker));
      console.log(companyData);
      switch (ratioChoice) {
        case 'Current Ratio': {
          for (let j = 0; j < companyData.length; j++) {
            const element = companyData[j].currentRatio;
            businessData.push(element);
          }
          break;
        }
        case 'Quick Ratio': {
          for (let j = 0; j < companyData.length; j++) {
            const element = companyData[j].quickRatio;
            businessData.push(element);
          }
          break;
        }
        case 'Working Capital': {
          for (let j = 0; j < companyData.length; j++) {
            const element = companyData[j].workingCapitalRatio;
            businessData.push(element);
          }
          break;
        }
        default: {
          for (let j = 0; j < companyData.length; j++) {
            const element = companyData[j].currentRatio;
            businessData.push(element);
          }
          break;
        }
      }
      console.log(businessData);
      // Collecting chart dataset
      datasetArray.push({
        label: ticker,
        data: businessData,
        borderColor: colorArray[i],
        backgroundColor: colorArray[i],
      });
    }
    console.log(datasetArray);
    options.plugins.title.text = 'Current Ratio';
    labels = [...new Set (companyDataCollection.map((item) => item.calendarYear))];

    chartData = {
      labels,
      datasets: datasetArray,
    };
    console.log(chartData);
  };

  // function to handle saving a ticker to portfolioChoice array
  const handleSaveTicker = async (ticker) => {
    if (portfolioChoice.includes(ticker)) {
      console.log(portfolioChoice);
    } else {
      setPortfolioChoice([...portfolioChoice, ticker]);
      collectCompanyData(ticker);
    }
  };

  // function to delete the ticker from portfolioChoice array
  const handleDeleteTicker = async (ticker) => {
    const tempArray = portfolioChoice;

    const updatedArray = tempArray?.filter((item) => item !== ticker) || [];

    setPortfolioChoice(updatedArray);
  };

  return (
    <>
      <Container fluid className='text-dark bg-blue'>
        <h2 className='text-center'>Ratio Analysis</h2>
        <Row>
          <Col xs={12} md={4}>
            <Form.Group className='mb-3' controlId='formRadio'>
              <Form.Label as='legend'>
                Ratio Choice:
              </Form.Label>
              <Col sm={{ span: 10, offset: 2 }}>
              {ratioArray.map((ratio, i) => (
                <Form.Check 
                  key={`radio-${i}`} 
                  type='radio' 
                  label={`${ratio}`} 
                  name='radio-ratio'
                  id={`radio${i}`}
                />
              ))}
              </Col>
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form onSubmit={handleFormSubmit}>
              <Form.Label>Search for Companies: </Form.Label>
              <Form.Control
                name='searchInput'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                type='text'
                size='lg'
                placeholder='Enter a ticker'
              />
              <Button type='submit' variant='primary'>
                Submit Search
              </Button>
            </Form>
            {(searchedCompany) && (
              <Card key={`choice-${searchedCompany}`} border='blue'>
                <Card.Header>{`${searchedCompany}`}</Card.Header>
                <Button
                  disabled={portfolioChoice?.some((savedTicker) => savedTicker === searchedCompany)}
                  className='btn-block btn-info' type='primary'
                  onClick={() => handleSaveTicker(searchedCompany)}>
                  {portfolioChoice?.some((savedTicker) => savedTicker === searchedCompany)
                  ? 'This company ticker has already been saved!'
                  : 'Save this Company!'}
                </Button>
              </Card>
            )}
          </Col>
          <Col xs={12} md={4}>
            <h6>
              {portfolioChoice.length
                ? `Viewing ${portfolioChoice.length} saved ${portfolioChoice.length === 1 ? 'company' : 'companies'}:`
                : 'You have not add any company in your portfolio!'}
            </h6>
            <ListGroup variant='flush'>
              {(portfolioChoice.length > 0) && (portfolioChoice.map((company) => (
                <ListGroup.Item key={`array-${company}`}>
                  {company}
                  <Button variant='light' onClick={() => handleDeleteTicker(company)}> 🗑️</Button>
                </ListGroup.Item>
              )))}
            </ListGroup>
          </Col>
        </Row>
        <Button className='btn-block btn-info' type='primary' onClick={() => showChart()}>Calculate Ratio</Button>
          <Col>
            <Line options={options} data={chartData} />;
          </Col>
      </Container>
    </>
  );
};

export default RatioPage;