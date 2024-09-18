const Product = require('../rest/db/models/product.js');

const resolvers = {
    // Resolver to fetch all products
    products: async () => {
        try {
            return await Product.find({});
        } catch (err) {
            throw new Error('Error fetching products');
        }
    },

    // Resolver to fetch a single product by ID
    product: async ({ id }) => {
        try {
            return await Product.findById(id);
        } catch (err) {
            throw new Error('Error fetching product');
        }
    },

    // Resolver to create a new product
    addProduct: async (args) => {
        const newProduct = new Product({
            name: args.input.name,
            sku: args.input.sku,
            description: args.input.description,
            price: args.input.price,
            category: args.input.category,
            manufacturer: args.input.manufacturer,
            amountInStock: args.input.amountInStock,
        });

        try {
            return await newProduct.save();
        } catch (err) {
            throw new Error('Error creating product');
        }
    },

    // Resolver to update an existing product
    updateProduct: async ({ id, input }) => {
        try {
            return await Product.findByIdAndUpdate(id, input, { new: true });
        } catch (err) {
            throw new Error('Error updating product');
        }
    },

    // Resolver to delete a product
    deleteProduct: async ({ id }) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error('Product not found');
            }
            return deletedProduct;
        } catch (err) {
            throw new Error('Error deleting product');
        }
    },

    // Resolver to calculate total stock value
    totalStockValue: async () => {
        try {
            const products = await Product.find({});
            return products.reduce((acc, product) => acc + (product.price * product.amountInStock), 0);
        } catch (err) {
            throw new Error('Error calculating total stock value');
        }
    },

    // Resolver to calculate total stock value by manufacturer
    totalStockValueByManufacturer: async () => {
        try {
            const products = await Product.find({});
            const manufacturerStock = {};

            products.forEach(product => {
                const manufacturer = product.manufacturer.name;
                if (!manufacturerStock[manufacturer]) {
                    manufacturerStock[manufacturer] = 0;
                }
                manufacturerStock[manufacturer] += product.price * product.amountInStock;
            });

            return Object.keys(manufacturerStock).map(manufacturer => ({
                manufacturer,
                totalValue: manufacturerStock[manufacturer]
            }));
        } catch (err) {
            throw new Error('Error calculating total stock value by manufacturer');
        }
    },

    // Resolver to fetch low stock products (less than 10 units)
    lowStockProducts: async () => {
        try {
            return await Product.find({ amountInStock: { $lt: 10 } });
        } catch (err) {
            throw new Error('Error fetching low stock products');
        }
    },

    // Resolver to fetch critical stock products (less than 5 units) with compact information
    criticalStockProducts: async () => {
        try {
            const products = await Product.find({ amountInStock: { $lt: 5 } });

            return products.map(product => ({
                manufacturer: product.manufacturer.name,
                contact: product.manufacturer.contact
            }));
        } catch (err) {
            throw new Error('Error fetching critical stock products');
        }
    },

    // Resolver to fetch all manufacturers the company works with
    manufacturers: async () => {
        try {
            const products = await Product.find({});
            const manufacturers = new Set();

            products.forEach(product => {
                manufacturers.add(product.manufacturer.name);
            });

            return Array.from(manufacturers);
        } catch (err) {
            throw new Error('Error fetching manufacturers');
        }
    },
};

module.exports = resolvers;

