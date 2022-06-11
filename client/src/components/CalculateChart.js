import React, { useState } from 'react';
import { Chart } from "../components/RatioChart";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

let labels = ['2017', '2018', '2019', '2020', '2021'];
const colorArray = ['red', 'blue', 'green', 'purple', 'orange', 'black', 'grey', 'yellow', 'pink', 'navy'];

export default function CalculateChart({ companyDataCollection, ratioChoice }) {

  const [chartData, setChartData] = useState({});
  console.log(ratioChoice);

  const portfolioArray = [...new Set (companyDataCollection.map((item) => item.ticker))];
  console.log(portfolioArray);

  const datasetArray = [];
  for (let i = 0; i < portfolioArray.length; i++) {
    const ticker = portfolioArray[i];
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
      case 'P/E Ratio': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].peRatio;
          businessData.push(element);
        }
        break;
      }         
      case 'ROA - Return On Assets': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].roa;
          businessData.push(element);
        }
        break;
      }
      case 'ROE - Return On Equity': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].roe;
          businessData.push(element);
        }
        break;
      }
      case 'ROCE - Return On Capital Employed': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].roce;
          businessData.push(element);
        }
        break;
      }     
      case 'Interest Coverage Ratio': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].interestCoverage;
          businessData.push(element);
        }
        break;
      }  
      case 'P/B - Price Book Value Ratio': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].pbRatio;
          businessData.push(element);
        }
        break;
      }
      case 'D/E - Debt Equity Ratio': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].debtEquity;
          businessData.push(element);
        }
        break;
      }     
      case 'Debt Ratio': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].debtRatio;
          businessData.push(element);
        }
        break;
      }     
      case 'Operating Profit Margin': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].operatingMargin;
          businessData.push(element);
        }
        break;
      } 
      case 'Net Profit Margin': {
        for (let j = 0; j < companyData.length; j++) {
          const element = companyData[j].netProfitMargin;
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

  // labels = [...new Set (companyDataCollection.map((item) => item.calendarYear))];

  setChartData({
    labels: labels,
    datasets:  datasetArray
  });
  console.log(chartData);

  return (
     <Chart chartData={chartData} ratioChoice={ratioChoice} />
  )
}