import React from 'react';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

// export const data = {
//   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

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
const companyBalanceData = [];

// collects company data from financialmodelingprep API
const getCompanyBalance = async (symbol) => {
    const ticker = symbol;
    // const keyAPI = `17460026230d940ebe74cf92231eb36e`; // nara1
    // const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2
    // const keyAPI = `0e0111a172272a2fcfd42016bb1d29cf`; // ethan
    // const keyAPI = `2c582395bb4c1edbb8f89db296b46aeb`; // brandon
    const keyAPI = `d819321c933c451db684ef4a2b41d62d`; // nara2

    let balanceURL = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${keyAPI}&limit=120`;
    const response = await fetch(balanceURL);

    if (!response.ok) {
        throw new Error('something went wrong!');
    }

    const items = await response.json();
    console.log(items);

    const companyBalanceData = items.map((company) => ({
        ticker: company.symbol,
        calendarYear: company.calendarYear,
        totalCurrentAssets: company.totalCurrentAssets,
        totalNonCurrentAssets: company.totalNonCurrentAssets,
        totalAssets: company.totalAssets,
        totalCurrentLiabilities: company.totalCurrentLiabilities,
        totalNonCurrentLiabilities: company.totalNonCurrentLiabilities,
        totalEquity: company.totalEquity,
        totalLiabilitiesAndTotalEuity: company.totalLiabilitiesAndTotalEuity,
    }));

    console.log(companyBalanceData);
};

const PieGraph = ({ticker}) => {

    const [chartData, setChartData] = useState({});
    console.log(ticker);

    const datasetArray = [];
    
    const yearChoice = '2021';
    getCompanyBalance(ticker);
    const businessData = companyBalanceData.filter((company) => (company.calendarYear === yearChoice));

    // Collecting chart dataset
    datasetArray.push({
        label: ticker,
        data: businessData,
        borderColor: borderColorArray,
        backgroundColor: bgColorArray,
        borderWidth: 1,
    });

    setChartData({
        labels: labels,
        datasets: datasetArray
    });
    console.log(chartData);

    return (
        <Pie data={chartData} />
    );
};

export default PieGraph;