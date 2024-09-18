// api/graphql.js
const { graphql } = require('graphql');
const { parse } = require('url');
const schema = require('../graphql/schema');
const resolvers = require('../graphql/models');
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/products`;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = mongoose.connection;
    console.log('Connected to MongoDB');
    return cachedDb;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your frontend domain in production
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    await connectToDatabase();

    const { query } = parse(req.url, true);

    const body = await getRequestBody(req);

    const result = await graphql(
      schema,
      body.query,
      resolvers,
      null,
      body.variables,
      body.operationName
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in GraphQL serverless function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to parse the request body
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}
