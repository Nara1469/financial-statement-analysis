const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `userPortfolio` array in User.js
const portfolioSchema = new Schema({
  ticker: {
    type: String,
    required: true,
    unique: true,
},
});

module.exports = portfolioSchema;