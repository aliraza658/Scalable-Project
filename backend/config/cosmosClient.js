// config/cosmosClient.js
const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});

const databaseName = process.env.COSMOS_DATABASE;

module.exports = { client, databaseName };