// /api/products.js
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Adjust the path as necessary

const uri = process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/products`;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    // Use existing database connection
    return cachedDb;
  }

  // Create a new database connection
  try {
    cachedDb = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    return cachedDb;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '/https://ims-one-theta.vercel.app/'); // Replace '*' with your frontend domain in production
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Respond to preflight requests
    return;
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const products = await Product.find();
      res.status(200).json(products);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in /api/products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
