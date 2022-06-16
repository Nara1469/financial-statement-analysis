# Financial Statement Analysis

MERN Stack App uses Chart.js and React-Chartjs-2 libraries

## About

Our application pulls various metrics and data out of financial statements published by publicly traded companies. With the data provided our users can plot, analyze key financial metrics and compare companies within their portfolio using visualization tools to make informed financial decisions.

## Table of Contents 

* [User Story](#user-story)
* [Installation](#installation)
* [License](#license)
* [Built With](#built-with)
* [Usage](#usage)
* [Wireframe](#wireframe)
* [Links](#links)
* [Contacts](#contacts)

## User Story

```
As a user, I want to be able to pull and analyze any company's financials in order to make sound financial decisions.
```

## Installation

See the link to the deployed site.

Otherwise to run locally, after cloning the repository run the code below:

```
npm i
npm run build
npm run start
npm run develop (for developer mode)
```

MongoDB will be needed to run the application locally.

**Note:** Update ./config/connection.js and the root/ .env as needed for your database info.

## License

🏆 This application is licensed under GNU GPL v2.

[![License: GPL v2](https://img.shields.io/badge/License-GPL_v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Built With

HTML / CSS / JavaScript / React.js / Node.js / Heroku / Express.js / MongoDB / GraphQL / JWT- JSON Web Token Authentication

## Usage

 - Sign-up or login by clicking on the "Login/Sign Up" button in the top right.

![Screen Shot 2022-06-12 at 11 42 02 PM](https://user-images.githubusercontent.com/93055909/173287384-61b807f7-a8a0-4165-93d6-a56e7746eacb.png)

 - Once signed in you'll see that the "Portfolio" and "Ratio" pages have been made available.
![Screen Shot 2022-06-12 at 11 42 46 PM](https://user-images.githubusercontent.com/93055909/173287392-bd488121-2847-42c6-b2ac-128d42640467.png)

 - On your portfolio page search and save companies to your Portfolio and review the profile, financial summary, and financial statement of those companies.

![Screen Shot 2022-06-12 at 11 44 34 PM](https://user-images.githubusercontent.com/93055909/173287604-806faa55-dd2e-45ad-8dc1-fdedc36eb7e1.png)

![Screen Shot 2022-06-12 at 11 45 39 PM](https://user-images.githubusercontent.com/93055909/173287707-505135c6-51bc-4435-8bd1-ec60400ba154.png)

![Screen Shot 2022-06-12 at 11 46 00 PM](https://user-images.githubusercontent.com/93055909/173287720-251694a8-30be-4064-95d1-2d98f8f9cdde.png)

 - In the ratio page search for the companies and metrics of your and use the visualization tools to draw comparisons.

![Screen Shot 2022-06-12 at 11 58 52 PM](https://user-images.githubusercontent.com/93055909/173289220-87def80a-264d-4497-83d5-01c099adf8c3.png)
![Screen Shot 2022-06-12 at 11 58 23 PM](https://user-images.githubusercontent.com/93055909/173289224-b85550fc-c14c-40c4-a477-8e3f0d41da99.png)

 - Lastly, leave this site better informed to make great financial decisions!

## Wireframe

Front-end file structure (React Components)

```                      
Financial Statement Analysis (index.js)
|
App.js
|
Navbar.js                
|
├── /pages   
│       │       
│       ├── Homepage.js                                        
│       ├── PortfolioPage.js  
│       │       │
│       │       └── Navigation.js
│       │               │
│       │               ├── Profile.js           
│       │               ├── Summary.js                           
│       │               └── Statement.js                           
│       │
│       └── RatioPage.js  
│               │       
│               └── RatioTable.js   
│    
├── LoginForm.js                                     
└── SignupForm.js
```

## Links

https://financial-analysis-project-du.herokuapp.com/

https://github.com/Nara1469/financial-statement-analysis

## Contacts

Nara Davaasuren - https://github.com/Nara1469

W. Brandon Comfort - https://github.com/Wbgc728
