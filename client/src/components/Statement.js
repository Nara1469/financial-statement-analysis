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
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
];
const borderColorArray = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
];

let symbol = 'AAPL';
let companyBalanceData = [];
let dataArray = [];

let chartPie = {
  labels,
  datasets: [
    {
      label: symbol,
      data: dataArray,
      borderColor: borderColorArray,
      backgroundColor: bgColorArray,
      borderWidth: 1,
    }
  ]
};

const StatementTab = ({ ticker }) => {

  const [chartPieData, setChartPieData] = useState({});

  useEffect(() => {
    return () => getChartInfo();
  }, [ticker, chartPieData]);

  const getChartInfo = async () => {

    const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon

    const balanceURL = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${keyAPI}&limit=120`;
    const response = await fetch(balanceURL);

    if (!response.ok) {
      throw new Error('something went wrong!');
    }

    const items = await response.json();
    console.log(items);

    companyBalanceData = items.map((company) => ({
      symbol: company.symbol,
      calendarYear: company.calendarYear,
      totalCurrentAssets: company.totalCurrentAssets,
      totalNonCurrentAssets: company.totalNonCurrentAssets,
      totalAssets: company.totalAssets,
      totalCurrentLiabilities: company.totalCurrentLiabilities,
      totalNonCurrentLiabilities: company.totalNonCurrentLiabilities,
      totalEquity: company.totalEquity,
      totalLiabilitiesAndTotalEuity: company.totalLiabilitiesAndTotalEquity,
    }));
    console.log(companyBalanceData);

    dataArray = [];
    dataArray.push(companyBalanceData[0].totalCurrentAssets);
    dataArray.push(companyBalanceData[0].totalNonCurrentAssets);
    dataArray.push(companyBalanceData[0].totalCurrentLiabilities);
    dataArray.push(companyBalanceData[0].totalNonCurrentLiabilities);
    dataArray.push(companyBalanceData[0].totalEquity);

    chartPie = {
      labels: labels,
      datasets: [
        {
          label: ticker,
          data: dataArray,
          borderColor: borderColorArray,
          backgroundColor: bgColorArray,
          borderWidth: 1,
        }
      ]
    };

    console.log(chartPie);
    setChartPieData(chartPie)
  }

  const downloadBalanceFile = async () => {

    const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon

    const downloadBalanceStatementURL = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?datatype=csv&apikey=${keyAPI}`;
    const response = await fetch(downloadBalanceStatementURL);

    if (!response.ok) {
      throw new Error('something went wrong!');
    }
  }

  return (
    <>
      <Container fluid className='text-dark bg-blue'>
        <h5 className='text-center'>Financial Statement</h5>
        {(companyBalanceData.length > 0) && (
          <Row className="justify-content-md-center">
            <Col xs={12} md={6}>
              <Card key={`statement-${companyBalanceData[0].symbol}`} border='blue'>
                <Card.Header>{`Company: ${companyBalanceData[0].symbol}`}</Card.Header>
                <Card.Body>
                  <Card.Title>{companyBalanceData[0].calendarYear} Financial Statements</Card.Title>
                  <Row>
                    <Col>
                      <Card.Text>Balance Sheet:</Card.Text>
                    </Col>
                    <Col>
                      <Button className='btn-block btn-info' type='primary' onClick={() => downloadBalanceFile()}>Download</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <h5 className='text-center'>{symbol}</h5>
              <Pie data={chartPieData} />
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
};

export default StatementTab;