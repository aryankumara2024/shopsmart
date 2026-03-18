/**
 * Database seeder — populates products table from the original products.json
 * Run with: node prisma/seed.js
 */

require('dotenv').config();
const prisma = require('../src/lib/prisma');
const products = require('../src/data/products.json');

async function main() {
  console.log('🌱 Seeding products...');

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        category: p.category,
        rating: p.rating,
        reviews: p.reviews,
        badge: p.badge ?? null,
        image: p.image ?? null,
        inStock: p.inStock,
        stock: p.stock,
        features: JSON.stringify(p.features || []),
        colors: JSON.stringify(p.colors || []),
      },
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        category: p.category,
        rating: p.rating,
        reviews: p.reviews,
        badge: p.badge ?? null,
        image: p.image ?? null,
        inStock: p.inStock,
        stock: p.stock,
        features: JSON.stringify(p.features || []),
        colors: JSON.stringify(p.colors || []),
      },
    });
  }

  console.log(`✅ Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
