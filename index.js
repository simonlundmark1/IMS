const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema'); // <-- Import the GraphQL schema
const resolvers = require('./graphql/models'); // Import the resolvers



require('dotenv').config();
const productRoutes = require('./rest/routes/products.js'); // Ensure path is correct

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/products`, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));






app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, "static"))); // Middleware for parsing JSON bodie
app.use(express.json()); // Middleware for parsing JSON bodies
 app.use('/products', productRoutes);

app.use(express.static(path.join(__dirname, 'public')));

 app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: resolvers, // Connects resolvers to the schema
    graphiql: true
    
}));

app.get("/", (req, res) => {
    res.send("Hello World!");
    res.json({ message: 'Hello from aids server!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
