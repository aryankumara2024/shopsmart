const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
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

        // Connect mapping and formatting data for Prisma/SQLite
        const formattedProducts = products.map(p => ({
            productId: p.id,
            name: p.name,
            price: typeof p.price === 'number' ? p.price : 0,
            originalPrice: typeof p.originalPrice === 'number' ? p.originalPrice : null,
            description: p.description || '',
            category: p.category || 'other',
            image: p.image || '',
            badge: p.badge || '',
            rating: typeof p.rating === 'number' ? p.rating : 0,
            reviews: typeof p.reviews === 'number' ? p.reviews : 0,
            colors: JSON.stringify(p.colors || []),
            features: JSON.stringify(p.features || [])
        }));

        // Clear existing products
        await prisma.product.deleteMany({});
        console.log('Cleared existing products...');

        // Insert new products sequentially
        for (const product of formattedProducts) {
             await prisma.product.create({ data: product });
        }
        console.log(`Successfully seeded ${products.length} products to your SQLite DB!`);

        await prisma.$disconnect();
    } catch (error) {
        console.error('Error seeding data:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

seedData();
