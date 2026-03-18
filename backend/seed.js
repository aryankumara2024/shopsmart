const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/Product');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
    try {
        // Read the frontend mock data file
        const dataPath = path.join(__dirname, '../client/src/data/products.js');
        const content = fs.readFileSync(dataPath, 'utf8');
        
        // Strip out 'export' to make it valid local JS we can evaluate
        const strippedContent = content.replace(/export\s+{.*};?/g, '');
        
        // Evaluate the text and extract the 'products' array
        const getProducts = new Function(`
            ${strippedContent}
            return products;
        `);
        
        const products = getProducts();

        // Connect to Mongo
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products...');

        // Insert new products
        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products to your MongoDB cluster!`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
