import React, { useState, useEffect } from 'react';
import { RatioTable } from '../components/RatioTable';
import { Container, Form, Row, Col, Button, Card, InputGroup } from 'react-bootstrap';
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
let companyDataCollection = [];
let datasetArray = [];
let labels = ['2017', '2018', '2019', '2020', '2021'];
// let labels = [];
const colorArray = ['red', 'blue', 'green', 'purple', 'orange', 'black', 'grey', 'yellow', 'pink', 'navy'];
const ratioArray = [
  'Current Ratio',
  'Quick Ratio',
  'P/E Ratio',
  'ROA - Return On Assets',
  'ROE - Return On Equity',
  'ROCE - Return On Capital Employed',
  'Interest Coverage Ratio',
  'P/B - Price Book Value Ratio',
  'D/E - Debt Equity Ratio',
  'Debt Ratio',
  'Operating Profit Margin',
  'Net Profit Margin'
];
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
let chartData = {
  labels,
  datasets: datasetArray,
};

// ------------ Functions ----------- 


// collects ratio data from financialmodelingprep API
const getRatioData = async (ticker) => {

  // const keyAPI = `17460026230d940ebe74cf92231eb36e`; // nara1
  // const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2
  // const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon
  const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon


  let ratioURL = `https://financialmodelingprep.com/api/v3/ratios/${ticker}?apikey=${keyAPI}&limit=120`;
  const response = await fetch(ratioURL);

  if (!response.ok) {
    throw new Error('something went wrong!');
  }

  const items = await response.json();
  // console.log(items);

  const yearArray = [];
  const currentRatioArray = [];
  const quickRatioArray = [];
  const peRatioArray = [];
  const roaArray = [];
  const roeArray = [];
  const roceArray = [];
  const interestCoverageArray = [];
  const pbRatioArray = [];
  const debtEquityArray = [];
  const debtRatioArray = [];
  const operatingMarginArray = [];
  const netProfitMarginArray = [];
  for (let i = 4; i >= 0; i--) {
    yearArray.push(items[i].date);
    currentRatioArray.push(items[i].currentRatio);
    quickRatioArray.push(items[i].quickRatio);
    peRatioArray.push(items[i].priceEarningsRatio);
    roaArray.push(items[i].returnOnAssets);
    roeArray.push(items[i].returnOnEquity);
    roceArray.push(items[i].returnOnCapitalEmployed);
    interestCoverageArray.push(items[i].interestCoverage);
    pbRatioArray.push(items[i].pbRatio);
    debtEquityArray.push(items[i].debtEquityRatio);
    debtRatioArray.push(items[i].debtRatio);
    operatingMarginArray.push(items[i].operatingProfitMargin);
    netProfitMarginArray.push(items[i].netProfitMargin);
  }
  companyDataCollection.push({
    ticker: ticker,
    calendarYear: yearArray,
    currentRatio: currentRatioArray,
    quickRatio: quickRatioArray,
    peRatio: peRatioArray,
    roa: roaArray,
    roe: roeArray,
    roce: roceArray,
    interestCoverage: interestCoverageArray,
    pbRatio: pbRatioArray,
    debtEquity: debtEquityArray,
    debtRatio: debtRatioArray,
    operatingMargin: operatingMarginArray,
    netProfitMargin: netProfitMarginArray,
  });

  console.log(companyDataCollection);
};

const RatioPage = () => {
  // create state for holding returned financialmodelingprep api data for a company
  const [searchedCompany, setSearchedCompany] = useState('');
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  // create state to hold saved userPortfolio tickers
  const [portfolioChoice, setPortfolioChoice] = useState([]);
  const [ratioChoice, setRatioChoice] = useState('Current Ratio');
  const [ratioTable, setRatioTable] = useState([]);

  useEffect(() => {
    showTable();
  }, [ratioChoice]);

  // method to search for tickers and set state on form submit
  const handleFormSubmit = async () => {
    if (!searchInput) {
      return false;
    }

    setSearchedCompany(searchInput);
    setSearchInput('');
  };

  // function to handle saving a ticker to portfolioChoice array
  const handleSaveTicker = async (ticker) => {
    if (portfolioChoice.includes(ticker)) {
      console.log(portfolioChoice);
    } else {
      setPortfolioChoice([...portfolioChoice, ticker]);
      getRatioData(ticker);
    }
  };

  // function to delete the ticker from portfolioChoice array
  const handleDeleteTicker = async (ticker) => {
    let tempArray = portfolioChoice;
    let updatedArray = tempArray?.filter((item) => item !== ticker) || [];
    setPortfolioChoice(updatedArray);

    // delete  the company from companyDataCollection array
    tempArray = companyDataCollection;
    updatedArray = tempArray?.filter((item) => item.ticker !== ticker) || [];
    companyDataCollection = updatedArray;

    // delete the company from ratioTable array
    tempArray = ratioTable;
    updatedArray = tempArray?.filter((item) => item.ticker !== ticker) || [];
    setRatioTable(updatedArray);
  };

  const showChart = () => {
    if (!portfolioChoice) {
      setRatioTable([]);
      companyDataCollection = [];
      chartData = {};
      return false;
    }

    datasetArray = [];
    let businessData = [];
    // console.log(companyDataCollection);
    // console.log(portfolioChoice);
    // console.log(ratioChoice);
    for (let i = 0; i < portfolioChoice.length; i++) {
      const ticker = portfolioChoice[i];
      switch (ratioChoice) {
        case 'Current Ratio': {
          businessData = companyDataCollection[i].currentRatio;
          break;
        }
        case 'Quick Ratio': {
          businessData = companyDataCollection[i].quickRatio;
          break;
        }
        case 'P/E Ratio': {
          businessData = companyDataCollection[i].peRatio;
          break;
        }
        case 'ROA - Return On Assets': {
          businessData = companyDataCollection[i].roa;
          break;
        }
        case 'ROE - Return On Equity': {
          businessData = companyDataCollection[i].roe;
          break;
        }
        case 'ROCE - Return On Capital Employed': {
          businessData = companyDataCollection[i].roce;
          break;
        }
        case 'Interest Coverage Ratio': {
          businessData = companyDataCollection[i].interestCoverage;
          break;
        }
        case 'P/B - Price Book Value Ratio': {
          businessData = companyDataCollection[i].pbRatio;
          break;
        }
        case 'D/E - Debt Equity Ratio': {
          businessData = companyDataCollection[i].debtEquity;
          break;
        }
        case 'Debt Ratio': {
          businessData = companyDataCollection[i].debtRatio;
          break;
        }
        case 'Operating Profit Margin': {
          businessData = companyDataCollection[i].operatingMargin;
          break;
        }
        case 'Net Profit Margin': {
          businessData = companyDataCollection[i].netProfitMargin;
          break;
        }
        default: {
          businessData = companyDataCollection[i].currentRatio;
          break;
        }
      }
      // Collecting chart dataset
      datasetArray.push({
        label: ticker,
        data: businessData,
        borderColor: colorArray[i],
        backgroundColor: colorArray[i],
      });

    }
    options.plugins.title.text = ratioChoice;
    // labels = [...new Set (companyDataCollection.map((item) => item.calendarYear.getFullYear()))];

    chartData = {
      labels,
      datasets: datasetArray,
    };
    console.log(chartData);
  };

  const showTable = async () => {

    if (portfolioChoice.length === 0) {
      companyDataCollection = [];
      return false;
    }

    setRatioTable([]);
    // console.log(companyDataCollection);
    // console.log(ratioChoice);
    let ratioTableCollection = [];
    switch (ratioChoice) {
      case 'Current Ratio': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.currentRatio[0],
          year2: company.currentRatio[1],
          year3: company.currentRatio[2],
          year4: company.currentRatio[3],
          year5: company.currentRatio[4],
        }))
        break;
      }
      case 'Quick Ratio': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.quickRatio[0],
          year2: company.quickRatio[1],
          year3: company.quickRatio[2],
          year4: company.quickRatio[3],
          year5: company.quickRatio[4],
        }))
        break;
      }
      case 'P/E Ratio': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.peRatio[0],
          year2: company.peRatio[1],
          year3: company.peRatio[2],
          year4: company.peRatio[3],
          year5: company.peRatio[4],
        }))
        break;
      }
      case 'ROA - Return On Assets': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.roa[0],
          year2: company.roa[1],
          year3: company.roa[2],
          year4: company.roa[3],
          year5: company.roa[4],
        }))
        break;
      }
      case 'ROE - Return On Equity': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.roe[0],
          year2: company.roe[1],
          year3: company.roe[2],
          year4: company.roe[3],
          year5: company.roe[4],
        }))
        break;
      }
      case 'ROCE - Return On Capital Employed': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.roce[0],
          year2: company.roce[1],
          year3: company.roce[2],
          year4: company.roce[3],
          year5: company.roce[4],
        }))
        break;
      }
      case 'Interest Coverage Ratio': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.interestCoverage[0],
          year2: company.interestCoverage[1],
          year3: company.interestCoverage[2],
          year4: company.interestCoverage[3],
          year5: company.interestCoverage[4],
        }))
        break;
      }
      case 'P/B - Price Book Value Ratio': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.pbRatio[0],
          year2: company.pbRatio[1],
          year3: company.pbRatio[2],
          year4: company.pbRatio[3],
          year5: company.pbRatio[4],
        }))
        break;
      }
      case 'D/E - Debt Equity Ratio': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.debtEquity[0],
          year2: company.debtEquity[1],
          year3: company.debtEquity[2],
          year4: company.debtEquity[3],
          year5: company.debtEquity[4],
        }))
        break;
      }
      case 'Debt Ratio': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.debtRatio[0],
          year2: company.debtRatio[1],
          year3: company.debtRatio[2],
          year4: company.debtRatio[3],
          year5: company.debtRatio[4],
        }))
        break;
      }
      case 'Operating Profit Margin': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.operatingMargin[0],
          year2: company.operatingMargin[1],
          year3: company.operatingMargin[2],
          year4: company.operatingMargin[3],
          year5: company.operatingMargin[4],
        }))
        break;
      }
      case 'Net Profit Margin': {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.netProfitMargin[0],
          year2: company.netProfitMargin[1],
          year3: company.netProfitMargin[2],
          year4: company.netProfitMargin[3],
          year5: company.netProfitMargin[4],
        }))
        break;
      }
      default: {
        ratioTableCollection = companyDataCollection.map((company) => ({
          ticker: company.ticker,
          year1: company.currentRatio[0],
          year2: company.currentRatio[1],
          year3: company.currentRatio[2],
          year4: company.currentRatio[3],
          year5: company.currentRatio[4],
        }))
        break;
      }
    }
    // console.log(ratioTableCollection);
    setRatioTable(ratioTableCollection);
    return true;
  };

  return (
    <>
      <Container fluid className='text-dark bg-blue'>
        <h2 className='text-center'>Ratio Analysis</h2>
        <Row>
          <Col xs={12} md={4}>
            <Form.Group className='mb-3' controlId='formRadio'>
              <Form.Label as='legend'>Ratio Choice: </Form.Label>
              <Col sm={{ span: 10, offset: 2 }}>
                {ratioArray.map((ratio, i) => (
                  <Form.Check
                    key={`radio-${i}`}
                    type='radio'
                    label={`${ratio}`}
                    name='radio-ratio'
                    id={`radio${i}`}
                    defaultChecked={ratioChoice === `${ratio}`}
                    onClick={() => setRatioChoice(`${ratio}`)}
                  />
                ))}
              </Col>
            </Form.Group>
          </Col>
          <Col xs={12} md={8}>
            <Row>
              <Col sm={{ span: 6, offset: 6 }}>
                <InputGroup className="mb-3">
                  <Form.Control
                    key={'ratio-search-input'}
                    name='searchInput'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                    type='text'
                    size='lg'
                    placeholder='Search for companies'
                  />
                  <Button variant="primary" id="button-addon2" onClick={() => handleFormSubmit()}>
                    Search
                  </Button>
                </InputGroup>
              </Col>
            </Row>
            {(searchedCompany) && (
              <Row>
                <Col sm={{ span: 6, offset: 6 }}>
                  <h6> Search Result:</h6>
                  <Row>
                    <Col md={6} className='single-ticker'>{searchedCompany}</Col>
                    <Col md={6}><Button
                      disabled={portfolioChoice?.some((savedTicker) => savedTicker === searchedCompany)}
                      className='btn-block btn-primary'
                      onClick={() => handleSaveTicker(searchedCompany)}>
                      {portfolioChoice?.some((savedTicker) => savedTicker === searchedCompany)
                        ? 'Saved!'
                        : 'Save this Company!'}
                    </Button></Col>
                  </Row>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
              <Card key={`ratio-basket`} border='blue' className='add-space'>
                <Card.Header>
                  {(portfolioChoice.length > 0)
                    ? `Ratio Analysis: (${portfolioChoice.length} ${portfolioChoice.length === 1 ? 'company' : 'companies'})`
                    : 'You have not add any company in the Ratio Analysis!'}
                </Card.Header>
                <Card.Body>
                  <Row>
                    {(portfolioChoice.length > 0) && (portfolioChoice.map((company, i) => (
                      <Col key={`ratio-${i}-${company.ticker}`}>
                        <Button variant='light'>{company}</Button>
                        <Button variant='light' onClick={() => handleDeleteTicker(company)} className='delete-mark'> ✘ </Button>
                      </Col>
                    )))}
                  </Row>
                </Card.Body>
              </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            {(ratioTable.length > 0) && (<RatioTable tableData={ratioTable} ratioChoice={ratioChoice} />)}
          </Col>
        </Row>
        <Button className='btn-block btn-primary' onClick={() => showChart()}>Show Chart</Button>
        <Col>
          {(chartData) && (<Line options={options} data={chartData} />)}
        </Col>
      </Container>
    </>
  );
};

export default RatioPage;