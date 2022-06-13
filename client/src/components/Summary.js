import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const SummaryTab = ({ ticker }) => {

  const [company, setCompany] = useState([]);

  useEffect(() => {

    const getSummaryInfo = async () => {
      let summaryData = {};

      const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon

      const companyURL = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${keyAPI}`;

      const response1 = await fetch(companyURL);

      if (!response1.ok) {
        throw new Error('something went wrong!');
      }

      const data = await response1.json();

      // console.log(data);
      
      summaryData.companyName = data[0].companyName;
      summaryData.symbol = data[0].symbol;
      summaryData.price = data[0].price;
      summaryData.beta = data[0].beta;
      summaryData.volAvg = data[0].volAvg;
      summaryData.mktCap = data[0].mktCap;
      summaryData.range = data[0].range;
      summaryData.dcf = data[0].dcf;
      summaryData.dcfDiff = data[0].dcfDiff;

      const ratioURL = `https://financialmodelingprep.com/api/v3/ratios-ttm/${ticker}?apikey=${keyAPI}`;

      const response2 = await fetch(ratioURL);

      if (!response2.ok) {
        throw new Error('something went wrong!');
      }

      const ratioData = await response2.json();

      // console.log(ratioData);
      
      summaryData.returnOnEquity = ratioData[0].returnOnEquityTTM;
      summaryData.returnOnAssets = ratioData[0].returnOnAssetsTTM;
      summaryData.operatingProfitMargin = ratioData[0].operatingProfitMarginTTM;
      summaryData.debtEquityRatio = ratioData[0].debtEquityRatioTTM;
      summaryData.priceEarningsRatio = ratioData[0].priceEarningsRatioTTM;
      summaryData.priceBookValueRatio = ratioData[0].priceBookValueRatioTTM;

      // console.log(summaryData);
      setCompany(summaryData);

    }
    getSummaryInfo();

  }, [ticker]);

  return (
    <>

      <Container fluid className='bg-success'>
        <h5 className='text-center text-white add-space'>Financial Summary</h5>
        {(company) && (
          <Card key={`summary-${company.symbol}`} border='blue' className='add-space'>

            <Card.Header>{company.companyName}</Card.Header>
            <Card.Body>
              <Row>
                <Col sm={12} md={1}>
                </Col>

                <Col sm={6} md={2} style={{ fontWeight: 'bold' }}>

                  <Card.Text>Symbol:</Card.Text>
                  <Card.Text>Price:</Card.Text>
                  <Card.Text>Beta:</Card.Text>
                  <Card.Text>Volume Avg:</Card.Text>
                  <Card.Text>Market Cap:</Card.Text>
                  <Card.Text>52 Week Range:</Card.Text>
                </Col>
                <Col sm={6} md={2} className='text-right'>
                  <Card.Text>{company.symbol}</Card.Text>
                  <Card.Text>{company.price}</Card.Text>
                  <Card.Text>{company.beta}</Card.Text>
                  <Card.Text>{company.volAvg}</Card.Text>
                  <Card.Text>{company.mktCap}</Card.Text>
                  <Card.Text>{company.range}</Card.Text>
                </Col>
                <Col sm={12} md={1}>
                </Col>

                <Col sm={5} md={2} style={{ fontWeight: 'bold' }}>

                  <Card.Text>DCF Unlevered:</Card.Text>
                  <Card.Text>DCF Levered:</Card.Text>
                  <Card.Text>ROE:</Card.Text>
                  <Card.Text>ROA:</Card.Text>
                  <Card.Text>Operating Margin:</Card.Text>
                  <Card.Text>Debt/Equity:</Card.Text>
                  <Card.Text>P/E:</Card.Text>
                  <Card.Text>P/B:</Card.Text>
                </Col>
                <Col sm={7} md={3} className='text-right'>
                  <Card.Text>{company.dcf}</Card.Text>
                  <Card.Text>{company.dcfDiff}</Card.Text>
                  <Card.Text>{company.returnOnEquity}</Card.Text>
                  <Card.Text>{company.returnOnAssets}</Card.Text>
                  <Card.Text>{company.operatingProfitMargin}</Card.Text>
                  <Card.Text>{company.debtEquityRatio}</Card.Text>
                  <Card.Text>{company.priceEarningsRatio}</Card.Text>
                  <Card.Text>{company.priceBookValueRatio}</Card.Text>
                </Col>
                <Col sm={12} md={1}>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default SummaryTab;
