const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Contact {
        name: String
        email: String
        phone: String
    }

    type Manufacturer {
        name: String
        country: String
        website: String
        description: String
        address: String
        contact: Contact
    }

    type Product {
        id: ID!
        name: String
        sku: String
        description: String
        price: Float
        category: String
        manufacturer: Manufacturer
        amountInStock: Int
    }

    type CompactProduct {
        manufacturer: String
        contact: Contact
    }

    type ManufacturerStockValue {
        manufacturer: String
        totalValue: Float
    }

    type Query {
        # Retrieve a list of all products
        products: [Product]

        # Retrieve details of a single product by ID
        product(id: ID!): Product

        # Retrieve the total value of all products in stock
        totalStockValue: Float

        # Retrieve the total value of products in stock, grouped by manufacturer
        totalStockValueByManufacturer: [ManufacturerStockValue]

        # Retrieve a list of products with less than 10 units in stock
        lowStockProducts: [Product]

        # Retrieve a compact list of products with less than 5 units in stock
        criticalStockProducts: [CompactProduct]

        # Retrieve a list of all manufacturers the company is doing business with
        manufacturers: [Manufacturer]
    }

    input ContactInput {
        name: String
        email: String
        phone: String
    }

    input ManufacturerInput {
        name: String
        country: String
        website: String
        description: String
        address: String
        contact: ContactInput
    }

    input ProductInput {
        name: String!
        sku: String!
        description: String!
        price: Float!
        category: String!
        manufacturer: ManufacturerInput!
        amountInStock: Int!
    }

    type Mutation {
        # Create a new product
        addProduct(input: ProductInput!): Product

        # Update an existing product by ID
        updateProduct(id: ID!, input: ProductInput!): Product

        # Delete a product by ID
        deleteProduct(id: ID!): Product
    }
`);

module.exports = schema;
