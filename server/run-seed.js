const prisma = require('./src/lib/prisma');
const fs = require('fs');
const path = require('path');

async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/products.json'), 'utf8'));
  for (const item of data) {
    if (await prisma.product.findUnique({where: {id: item.id}})) continue;
    await prisma.product.create({
      data: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        category: item.category,
        rating: item.rating,
        reviews: item.reviews,
        badge: item.badge,
        image: item.image,
        inStock: item.inStock,
        stock: item.stock || 10,
        features: JSON.stringify(item.features || []),
        colors: JSON.stringify(item.colors || [])
      }
    });
  }
  console.log("Seeded", data.length, "products");
}
main().catch(console.error).finally(() => prisma.$disconnect());
