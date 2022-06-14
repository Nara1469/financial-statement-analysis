import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

let labels = [
  'Current Assets',
  'Non-Current Assets',
  'Current Liabilities',
  'Non-Current Liabilities',
  'Stockholder\'s Equity',
];
const bgColorArray = [

  'red',
  'blue',

  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
];
const borderColorArray = [

  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
];
let dataArray = [];
const options = {
  layout: {
    padding: {
      left: 50
    }
  }
};
  
let chartPie = {
  labels,
  datasets: [
    {

      label: '',

      data: dataArray,
      borderColor: borderColorArray,
      backgroundColor: bgColorArray,
      borderWidth: 1,
    }
  ]
};

const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon

const StatementTab = ({ ticker }) => {

  const [companyBalanceData, setCompanyBalanceData] = useState({});
  const [company, setCompany] = useState('');

  useEffect(() => {
    getChartInfo();
  }, [ticker]);

  const getChartInfo = async () => {

    const balanceURL = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${keyAPI}&limit=120`;
    const response = await fetch(balanceURL);

    if (!response.ok) {
      throw new Error('something went wrong!');
    }

    const items = await response.json();
    console.log(items);


    const companyData = {
      symbol: items[0].symbol,
      calendarYear: items[0].calendarYear,
      totalCurrentAssets: items[0].totalCurrentAssets,
      totalNonCurrentAssets: items[0].totalNonCurrentAssets,
      totalAssets: items[0].totalAssets,
      totalCurrentLiabilities: items[0].totalCurrentLiabilities,
      totalNonCurrentLiabilities: items[0].totalNonCurrentLiabilities,
      totalEquity: items[0].totalEquity,
      totalLiabilitiesAndTotalEuity: items[0].totalLiabilitiesAndTotalEquity,
    };

    setCompanyBalanceData(companyData);
    setCompany(ticker);
    console.log(companyBalanceData);

    dataArray = [];
    dataArray.push(companyBalanceData.totalCurrentAssets);
    dataArray.push(companyBalanceData.totalNonCurrentAssets);
    dataArray.push(companyBalanceData.totalCurrentLiabilities);
    dataArray.push(companyBalanceData.totalNonCurrentLiabilities);
    dataArray.push(companyBalanceData.totalEquity);

    chartPie = {
      labels: labels,
      datasets: [
        {

          label: company,
          data: dataArray,
          borderColor: borderColorArray,
          backgroundColor: bgColorArray,
          borderWidth: 1,
        }
      ]
    };

    console.log(chartPie);

  }

  return (
    <>

      <Container fluid className='bg-light'>
        <h5 className='text-center text-dark add-space'>Financial Statement</h5>
        {(companyBalanceData) && (

          <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
              <Card key={`statement-${companyBalanceData.symbol}`} border='blue' className='add-space'>
                <Card.Header>{`Company: ${companyBalanceData.symbol}`}</Card.Header>
                <Card.Body>
                  <Card.Title className='text-info text-center' style={{fontWeight: 'bold'}}>{companyBalanceData.calendarYear} Financial Statements</Card.Title>
                  <Row className='add-space'>
                    <Col>
                      <Card.Text>• Balance Sheet:</Card.Text>
                    </Col>
                    <Col>
                      <a download href={`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?datatype=csv&apikey=${keyAPI}`}>
                      <Button className='btn-block btn-info'>Download</Button>
                      </a>
                    </Col>
                  </Row>
                  <Row className='add-space'>
                    <Col>
                      <Card.Text>• Income Statement:</Card.Text>
                    </Col>
                    <Col>
                      <a download href={`https://financialmodelingprep.com/api/v3/income-statement/${ticker}?datatype=csv&apikey=${keyAPI}`}>
                      <Button className='btn-block btn-info'>Download</Button>
                      </a>
                    </Col>
                  </Row>
                  <Row className='add-space'>
                    <Col>
                      <Card.Text>• Cash Flow Statement:</Card.Text>
                    </Col>
                    <Col>
                      <a download href={`https://financialmodelingprep.com/api/v3/cash-flow-statement/${ticker}?datatype=csv&apikey=${keyAPI}`}>
                      <Button className='btn-block btn-info'>Download</Button>
                      </a>

                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>

              <h5 className='text-center'>{ticker}</h5>
              <Pie options={options} data={chartPie} />

            </Col>
          </Row>
        )}
      </Container>
    </>
  )
};

export default StatementTab;